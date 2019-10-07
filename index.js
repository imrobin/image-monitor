/*
 * 图片裁切Monitor
 */
const process = require('child_process');
const cropSub = process.fork(`${__dirname}/crop-sub.js`);
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const log = console.log.bind(console);
const IGNORE_FILES = /(^\..+)|(.+[\/\\]\..+)/; // 忽略文件.开头
const IMAGE_FILE_EXTS = ['.jpg', '.jpeg', '.png', '.bmp', '.gif'];

/*
let watcherOpts = {
    watchImgDir: '',
    ignoreFiles: '',
    depth: 0
};

let cropOpts = {
    savePath: '保存路径',
    scaleSizeList: [{ width: 80, height: 80 }, { width: 110, height: 110 }, { width: 240, height: 240 }, { width: 400, height: 400 }, { width: 800, height: 800 }, { width: 960, height: 960 }]
};
*/
function CropMonitor(watcherOpts, cropOpts) {
    watchImgDir = 'images'; // 默认图片文件夹
    isInited = false;
    
    savePath = cropOpts && cropOpts.savePath;
    scaleSizes = cropOpts && cropOpts.scaleSizeList;
    let _this = this;

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
            log('初始化扫描文件完成,准备监听');
        });

    log('图片裁切监控已经启动');

    this.deleteOnUnlink = function(del) {
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
                option = {
                    event: 'unlink',
                    imgPath: imgPath,
                    scaleSizeList: scaleSizes
                };
                cropSub.send(option);
            }
        });
    };

    this.cropOnAdd = function(crop) {
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
                option = {
                    event: 'add',
                    imgPath: imgPath,
                    scaleSizeList: scaleSizes
                };
                cropSub.send(option);
            }
        });
    };

    this.cropOnChange = function(crop) {
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
                option = {
                    event: 'change',
                    imgPath: imgPath,
                    scaleSizeList: scaleSizes
                };
                cropSub.send(option);
            }
        });
    };
}

module.exports = CropMonitor;