const CropMonitor = require('./index.js');


let watcherOpts = {
    watchImgDir: 'images',
    ignoreFiles: '',
    depth: 0
};

let cropOpts = {
    savePath: 'images',
    maxCropScale: 1.5,
    quality: 60,
    scaleSizeList: [{ width: 80, height: 80, quality: 70 }, { width: 110, height: 110, quality: 70 }, { width: 240, height: 240, quality: 70 }, { width: 400, height: 400, quality: 70 }, { width: 800, height: 800, quality: 70 }, { width: 960, height: 960, quality: 70 }]
};

let crop = new CropMonitor(watcherOpts, cropOpts);
crop.cropOnAdd(true);
crop.deleteOnUnlink(true);