/*
 * 图片裁切Monitor
 */
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const log4js = require('log4js');
log4js.configure('log4js.json');
const log = log4js.getLogger("monitor");

const IGNORE_FILES = /(^\..+)|(.+[\/\\]\..+)/; // 忽略文件.开头
const IMAGE_FILE_EXTS = ['.jpg', '.jpeg', '.png', '.bmp', '.gif'];
let cropSub = child_process.fork(path.join(__dirname, '/crop-sub.js'));

/*

let opt = {
    watcher: {
        ignoreFiles: '',
        depth: 0
    },
    cropper: [{
        watchObj: 'images1',
        savePath: 'images',
        maxCropScale: 1.5,
        quality: 60,
        scaleSizeList: [{ width: 80, height: 80, quality: 70 }, { width: 110, height: 110, quality: 70 }, { width: 240, height: 240, quality: 70 }, { width: 400, height: 400, quality: 70 }, { width: 800, height: 800, quality: 70 }, { width: 960, height: 960, quality: 70 }]
    }, {
        watchObj: 'images2',
        savePath: 'images',
        maxCropScale: 1.5,
        quality: 60,
        scaleSizeList: [{ width: 80, height: 80, quality: 70 }, { width: 110, height: 110, quality: 70 }, { width: 240, height: 240, quality: 70 }, { width: 400, height: 400, quality: 70 }, { width: 800, height: 800, quality: 70 }, { width: 960, height: 960, quality: 70 }]
    }]
};
*/
function CropMonitor(opt) {
    let watcherOpts = opt.watcher || {
        ignoreFiles: '',
        depth: 0
    };
    watcherOpts.watchImgDir = watcherOpts.watchImgDir || [];

    let cropOpts = opt.cropper || [];
    cropOpts.forEach((option) => {
        watcherOpts.watchImgDir.push(option.watchObj);
    });

    let isInited = false;
    
    this.isImage = function (image) {
        let ext = path.extname(image);
        if (ext != '') {
            if (path.sep == '/') {
                if (image.indexOf('\\') != -1) {
                    return false;
                }
            } else {
                if (image.indexOf('/') != -1) {
                    return false;
                }
            }

            if (IMAGE_FILE_EXTS.indexOf(ext) == -1) {
                return false;
            }
        }
        return true;
    };
    
    log.info(watcherOpts.watchImgDir);
    // 监控文件夹
    watcher = chokidar.watch(watcherOpts.watchImgDir, {
        ignored: watcherPath => {
            let ignoreFiles = watcherOpts.ignoreFiles || IGNORE_FILES;
            let ignored = ignoreFiles.test(watcherPath);
            return ignored;
        },
        depth: watcherOpts.depth || 0,
        persistent: true // 保持监听状态
    });

    watcher
        .on('error', function (error) {
            console.info('发生了错误：', error);
        })
        .on('ready', function () {
            isInited = true;
            log.info('初始化扫描文件完成,准备监听');
        });

    log.info('图片裁切监控已经启动');

    this.getCropper = function(imgPath) {
        for (let i = 0; i < cropOpts.length; i++) {
            let cropper = cropOpts[i];
            let watchPath = path.resolve(cropper.watchObj);
            let watchPath0 = path.resolve(imgPath);
            if (watchPath0.indexOf(watchPath) == 0) {
                return cropper;
            }
        }
        return null;
    };

    this.deleteOnUnlink = function(del) {
        let _this = this;
        if (typeof del != 'boolean') {
            console.error('deleteOnUnlink arguments invalid.');
            return;
        }

        if (!del) {
            return;
        }
        watcher.on('unlink', function (imgPath) {
            let _isImage = _this.isImage(imgPath);
            if (isInited && _isImage) {
                let cropper = _this.getCropper(imgPath);
                if (cropper != null) {
                    option = {
                        event: 'unlink',
                        imgPath: imgPath,
                        cropper: cropper
                    };
                    cropSub.send({
                        type: "OPTION",
                        data: option
                    });
                }
            }
        });
    };

    this.cropOnAdd = function(crop) {
        let _this = this;
        if (typeof crop != 'boolean') {
            console.error('cropOnAdd arguments invalid.', typeof crop);
            return;
        }

        if (!crop) {
            return;
        }
        watcher.on('add', function (imgPath) {
            let _isImage = _this.isImage(imgPath);
            if (isInited && _isImage) {
                let cropper = _this.getCropper(imgPath);
                if (cropper != null) {
                    option = {
                        event: 'add',
                        imgPath: imgPath,
                        cropper: cropper
                    };
                    cropSub.send({
                        type: "OPTION",
                        data: option
                    });
                }
            }
        });
    };

    this.cropOnChange = function(crop) {
        let _this = this;
        if (typeof crop != 'boolean') {
            console.error('cropOnChange arguments invalid.');
            return;
        }

        if (!crop) {
            return;
        }
        watcher.on('change', function (imgPath) {
            let _isImage = _this.isImage(imgPath);
            if (isInited && _isImage) {
                let cropper = _this.getCropper(imgPath);
                if (cropper != null) {
                    option = {
                        event: 'change',
                        imgPath: imgPath,
                        cropper: cropper
                    };
                    cropSub.send({
                        type: "OPTION",
                        data: option
                    });
                }
            }
        });
    };
}

module.exports = CropMonitor;