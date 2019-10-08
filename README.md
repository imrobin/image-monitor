# image-monitor

> 监控图片夹，进行图片处理

[![NPM](https://nodei.co/npm/image-monitor.png)](https://www.npmjs.com/package/image-monitor)

## Getting started
Install with npm:

```sh
npm install image-monitor
```

Then `require` and use it in your code:

```javascript
const CropMonitor = require('image-monitor');
let watcherOpts = {
    watchImgDir: '图片目录',
    ignoreFiles: '',
    depth: 0
};

let cropOpts = {
    savePath: '图片保存目录',
    scaleSizeList: [{ width: 80, height: 80 }, { width: 110, height: 110 }, { width: 240, height: 240 }]
};

let crop = new CropMonitor(watcherOpts, cropOpts);
crop.cropOnAdd(true);
crop.deleteOnUnlink(true);
```

## API

```javascript
// define argments of watcher.
let watcherOpts = {
    watchImgDir: '图片目录',
    ignoreFiles: '',
    depth: 0
};

// Define argments of crop.
let cropOpts = {
    savePath: '图片保存目录',
    scaleSizeList: [{ width: 80, height: 80 }, { width: 110, height: 110 }, { width: 240, height: 240 }]
};

// Initialize CropMonitor.
let crop = new CropMonitor(watcherOpts, cropOpts);

// Set event method.
// Crop images when event of add triggered.
crop.cropOnAdd(true);

// Crop images when event of unlink triggered.
crop.deleteOnUnlink(true);

// Crop images when event of change triggered.
crop.cropOnChange(true);
```