const cropMonitor = require('./index.js');


let watcherOpts = {
    watchImgDir: 'images',
    ignoreFiles: '',
    depth: 0
};

let cropOpts = {
    savePath: 'images1',
    scaleSizeList: [{ width: 80, height: 80 }, { width: 110, height: 110 }, { width: 240, height: 240 }, { width: 400, height: 400 }, { width: 800, height: 800 }, { width: 960, height: 960 }]
};

let crop = new cropMonitor(watcherOpts, cropOpts);
crop.cropOnAdd(true);