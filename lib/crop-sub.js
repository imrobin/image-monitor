const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const log = console.log.bind(console);

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

let start = function() {
    if (running) {
        console.error('crop-monitor already started.')
        return;
    }

    running = true;
    let waitTime = 350;
    let working = false;
    setTimeout(crop, waitTime);
    log('图片裁切处理服务已经启动');

    function crop() {
        if (!working) {
            working = true;
            let option = CROP_QUEUE.shift();
            if (option) {
                log('正在处理图片' + option.imgPath + ', event:' + option.event + ', 队列任务数量:' + CROP_QUEUE.length);
                let cropPromises = [];
                option.scaleSizeList.forEach((size) => {
                    if (option.event == 'add') {
                        cropPromises.push(cropImg(option.imgPath, size, option.savePath));
                    } else if (option.event == 'unlink') {
                        cropPromises.push(deleteImg(option.imgPath, size, option.savePath))
                    } else {
                        console.error('Not support ' + option.event + '.')
                    }
                });
                Promise.all(cropPromises)
                    .then(()=>{
                        log('图片处理(event:' + option.event + ') ' + option.imgPath + ' 成功');
                        working = false;
                        setTimeout(crop, waitTime);
                    })
                    .catch((res)=>{
                        let error = ERRORS[res.code];
                        if (error) {
                            log('图片处理(event:' + option.event + ') ' + option.imgPath + ' 失败', error);
                        } else {
                            log('图片处理(event:' + option.event + ') ' + option.imgPath + ' 失败', res);
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

function cropImg(imgPath, size, savePath) {
    return Jimp.read(imgPath)
        .then(image => {
            savePath = savePath || path.dirname(imgPath);
            let wpath = path.join(path.resolve(savePath), size.width + "_" + size.height, path.basename(imgPath));
            let width = size.width > image.getWidth() ? image.getWidth() : size.width;
            let height = size.height > image.getHeight() ? image.getHeight() : size.height;
            return image.scaleToFit(width, height, Jimp.AUTO)
                .quality(quality) // set JPEG quality
                .write(wpath); // save
        });
}

function deleteImg(imgPath, size, savePath) {
    return new Promise((resolve, reject) => {
        savePath = savePath || path.dirname(imgPath);
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
    savePath: '',
    scaleSizeList: [{ width: 80, height: 80 }, { width: 110, height: 110 }, { width: 240, height: 240 }, { width: 400, height: 400 }, { width: 800, height: 800 }, { width: 960, height: 960 }]
};
let msg = {
    type: "SYSTEM",// STSTEM,OPTION
    data: {}
}
*/
process.on('message', (msg) => {
    //console.log('CHILD got message:', msg);
    if (msg.type == "SYSTEM") {
        let data = msg.data;
        quality = data.quality || quality;
    } else if (msg.type == "OPTION") {
        CROP_QUEUE.push(msg.data);
    }
  });

start();
