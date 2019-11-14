const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const log4js = require('log4js');
log4js.configure('log4js.json');
const log = log4js.getLogger("monitor");

const CROP_QUEUE = new Array();
const WAIT_TIME = 1000;//每个任务处理间隔时间（单位：毫秒）
const ERRORS = {
    "ENAMETOOLONG": "文件路径太长",
    "ENOENT": "文件路径不存在",
    "ENOTDIR": "文件路径目录不存在",
    "ENOMEM": "内存不足",
    "EIO": "IO读写错误",
    "EACCES": "没有写入权限",
    "EBUSY": "文件正在使用"
};

let quality = 75; // 图片质量，默认75
let running = false;
let cropper;

let start = function() {
    if (running) {
        log.error('crop-monitor already started.')
        return;
    }

    running = true;
    let waitTime = 350;
    let working = false;
    setTimeout(crop, waitTime);
    log.info('图片裁切处理服务已经启动.');

    function crop() {
        if (!working) {
            working = true;
            let option = CROP_QUEUE.shift();
            if (option) {
                log.info('正在处理图片' + option.imgPath + ', event:' + option.event + ', 队列任务数量:' + CROP_QUEUE.length);
                let cropPromises = [];
                let cropper = option.cropper;
                let scaleSizeList = cropper.scaleSizeList;
                delete cropper.scaleSizeList;
                scaleSizeList.forEach((size) => {
                    cropper.size = size;
                    if (option.event == 'add') {
                        cropPromises.push(cropImg(option.imgPath, cropper));
                    } else if (option.event == 'unlink') {
                        cropPromises.push(deleteImg(option.imgPath, cropper));
                    } else {
                        log.error('Not support ' + option.event + '.');
                    }
                });
                Promise.all(cropPromises)
                    .then(() => {
                        log.info('图片处理(event:' + option.event + ') ' + option.imgPath + ' 成功.');
                        working = false;
                        setTimeout(crop, waitTime);
                    })
                    .catch((res)=>{
                        let error = ERRORS[res.code];
                        if (error) {
                            log.error('图片处理(event:' + option.event + ') ' + option.imgPath + ' 失败', error);
                        } else {
                            log.error('图片处理(event:' + option.event + ') ' + option.imgPath + ' 失败', res);
                        }
                        working = false;
                        setTimeout(crop, waitTime);
                    });
            } else {
                working = false;
                setTimeout(crop, WAIT_TIME);
            }
        } else {
            setTimeout(crop, waitTime);
        }
    }
};

function cropImg(imgPath, cropper) {
    let size = cropper.size;
    return Jimp.read(imgPath)
        .then(image => {
            let maxCropScale = cropper.maxCropScale || 1.5;// 裁切图片时最大高宽比，当裁切的图片高宽比大于此值时，不进行裁切；高度/宽度
            let hwScale = parseFloat(image.getHeight()) / parseFloat(image.getWidth());
            if (hwScale < maxCropScale) {
                let savePath = cropper.savePath || path.dirname(imgPath);
                let wpath = path.join(path.resolve(savePath), size.width + "_" + size.height, path.basename(imgPath));
                let width = size.width > image.getWidth() ? image.getWidth() : size.width;
                let height = size.height > image.getHeight() ? image.getHeight() : size.height;
                log.info('imgPath:' + imgPath + ', size:' + size.width + "_" + size.height);
                return image.scaleToFit(width, height, Jimp.AUTO)
                    .quality(size.quality || quality) // set JPEG quality
                    .write(wpath); // save
            } else {
                return Promise.resolve();
            }
        });
}

function deleteImg(imgPath, cropper) {
    return new Promise((resolve, reject) => {
        let size = cropper.size;
        let savePath = cropper.savePath || path.dirname(imgPath);
        let wpath = path.join(path.resolve(savePath), size.width + "_" + size.height, path.basename(imgPath));
        fs.unlink(wpath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/*
let option = {
    event: 'add', //add,unlink
    imgPath: '',
    cropper: {
        savePath: '',
        maxCropScale: 1.5,
        scaleSizeList: [{ width: 80, height: 80, quality: 70 }, { width: 110, height: 110, quality: 70 }, { width: 240, height: 240, quality: 70 }, { width: 400, height: 400, quality: 70 }, { width: 800, height: 800, quality: 70 }, { width: 960, height: 960, quality: 70 }]
    }
};
let msg = {
    type: "SYSTEM",// STSTEM,OPTION
    data: {}
}
*/
process.on('message', (msg) => {
    if (msg.type == "SYSTEM") {
        let data = msg.data;
    } else if (msg.type == "OPTION") {
        CROP_QUEUE.push(msg.data);
    }
  });

start();
