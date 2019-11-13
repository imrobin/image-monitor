# image-monitor

> Monitor image directories for image processing

[![NPM](https://nodei.co/npm/image-monitor.png)](https://www.npmjs.com/package/image-monitor)

## Getting started
Install with npm:

```sh
npm install image-monitor
```

Then `require` and use it in your code:

```javascript
const CropMonitor = require('image-monitor');
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
```

## API

```javascript
// Define argments of watcher and crop.
let opt = {
    watcher: {
        ignoreFiles: '',
        depth: 0
    },
    cropper: [{
        watchObj: 'images1',
        savePath: 'image save directory',
        maxCropScale: 1.5,
        quality: 70,// image quality
        scaleSizeList: [{ width: 80, height: 80, quality: 70 }, { width: 110, height: 110, quality: 70 }, { width: 240, height: 240, quality: 70 }, { width: 400, height: 400, quality: 70 }, { width: 800, height: 800, quality: 70 }, { width: 960, height: 960, quality: 70 }]
    }, {
        watchObj: 'images2',
        savePath: 'image save directory',
        maxCropScale: 1.5,
        quality: 70,// image quality
        scaleSizeList: [{ width: 80, height: 80, quality: 70 }, { width: 110, height: 110, quality: 70 }, { width: 240, height: 240, quality: 70 }, { width: 400, height: 400, quality: 70 }, { width: 800, height: 800, quality: 70 }, { width: 960, height: 960, quality: 70 }]
    }]
};

// Initialize CropMonitor.
let crop = new CropMonitor(opt);

// Set event method.
// Crop images when event of add triggered.
crop.cropOnAdd(true);

// Crop images when event of unlink triggered.
crop.deleteOnUnlink(true);

// Crop images when event of change triggered.
crop.cropOnChange(true);
```

`new CropMonitor(opt)`

* `opt` (object) Images directory monitor configuration. Options object as defined below:[watcher](#watcher)、[cropper](#cropper).

#### watcher

(object). watcher monitor configuration.

* `ignoreFiles` (string of regular expression, default: `/(^\..+)|(.+[\/\\]\..+)/`).
    - Note: Supported format: `'.jpg', '.jpeg', '.png', '.bmp', '.gif'`.

* `depth` (default: `0`). If set, limits how many levels of
subdirectories will be traversed.

#### cropper

(object array). cropper configuration.

* `watchObj` (string). Paths to files, dirs to be watched recursively, or glob patterns.
    - Note: globs must not contain windows separators (`\`),
    because that's how they work by the standard —
    you'll need to replace them with forward slashes (`/`).
    - Note 2: for additional glob documentation, check out low-level
    library: [picomatch](https://github.com/micromatch/picomatch).

* `savePath` (string). Paths to files, dirs to be saved. If not set, savePath is parent directory of original file. Subdirectory is dynamic, that named by width and height of scaleSizeList.
Naming format of subdirectory "`width`_`height`".

* `quality` (number, default: `75`). Set the quality of saved JPEG, 0 - 100.


* `scaleSizeList` (object array). Crop the image size array.

## Using help

* [Node.js: what is ENOSPC error and how to solve?](https://stackoverflow.com/questions/22475849/node-js-what-is-enospc-error-and-how-to-solve).

## License

MIT