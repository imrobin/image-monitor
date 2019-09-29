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
const ONLY_WATCH_NEW_FILE = true;//是否只检测新增文件

let imgDir = 'images'; // 默认图片文件夹
let isInited = false;

// 监控文件夹
var watcher = chokidar.watch(imgDir, {
    ignored: watcherPath => {
        return IGNORE_FILES.test(watcherPath);
    },
    depth: 0,
    persistent: true // 保持监听状态
});

// 监听增加，删除文件的事件
watcher
    .on('add', function (imgPath) {
        if (isInited) {
            option = {
                event: 'add',
                imgPath: imgPath,
                widthList: SCALE_SIZE_ARRAY
            };
            cropSub.send(option);
        }
    })
    .on('unlink', function (imgPath) {
        if (isInited) {
            option = {
                event: 'unlink',
                imgPath: imgPath,
                widthList: SCALE_SIZE_ARRAY
            };
            cropSub.send(option);
        }
    })
    .on('error', function (error) {
        console.info('发生了错误：', error);
    })
    .on('ready', function () {
        isInited = true;
        log('初始化扫描文件完成,准备监听');
    });

log('图片裁切监控已经启动');