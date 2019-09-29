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
const SCALE_SIZE_ARRAY = [ 80, 110, 240, 400, 800, 960 ];

let imgDir = 'images'; // 默认图片文件夹

// 监控文件夹
var watcher = chokidar.watch(imgDir, {
    ignored: watcherPath => {
        return IGNORE_FILES.test(watcherPath);
    },
    depth: 0,
    persistent: true // 保持监听状态
});

// 监听增加，删除文件的事件
watcher.on('all', (event, imgPath) => {
    let option = {};
    switch (event) {
        case 'add':
            option = {
                event: 'add',
                imgPath: imgPath,
                widthList: SCALE_SIZE_ARRAY
            };
            cropSub.send(option);
            break;
        case 'unlink':
            option = {
                event: 'unlink',
                imgPath: imgPath,
                widthList: SCALE_SIZE_ARRAY
            };
            cropSub.send(option);
            break;
        default:
            break;
    }
});

log('图片裁切监控已经启动');