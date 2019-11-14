const CropMonitor = require('./index.js');

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

let crop = new CropMonitor(opt);
crop.cropOnAdd(true);
crop.deleteOnUnlink(true);