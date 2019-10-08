# image-monitor

> 监控图片夹，进行图片处理

[![NPM](https://nodei.co/npm/image-monitor.png)](https://www.npmjs.com/package/image-monitor)

## Getting started
Install with npm:

```sh
npm install image-monitor
```

Then `require` and use it in your code:

``` javascript
const CropMonitor = require('image-monitor');
let watcherOpts = {
    watchImgDir: '图片目录',
    ignoreFiles: '',
    depth: 0
};

let cropOpts = {
    savePath: 'images',
    scaleSizeList: [{ width: 80, height: 80 }, { width: 110, height: 110 }, { width: 240, height: 240 }, { width: 400, height: 400 }, { width: 800, height: 800 }, { width: 960, height: 960 }]
};

let crop = new CropMonitor(watcherOpts, cropOpts);
crop.cropOnAdd(true);
crop.deleteOnUnlink(true);
```