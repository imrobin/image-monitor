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
let watcherOpts = {
    watchImgDir: 'image directory',
    ignoreFiles: '',
    depth: 0
};

let cropOpts = {
    savePath: 'image save directory',
    scaleSizeList: [{ width: 80, height: 80 }, { width: 110, height: 110 }, { width: 240, height: 240 }]
};

let crop = new CropMonitor(watcherOpts, cropOpts);
crop.cropOnAdd(true);
crop.deleteOnUnlink(true);
```

## API

```javascript
// Define argments of watcher.
let watcherOpts = {
    watchImgDir: 'image directory',
    ignoreFiles: '',
    depth: 0
};

// Define argments of crop.
let cropOpts = {
    savePath: 'image save directory',
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

`new CropMonitor(watcherOpts, cropOpts)`

* `watcherOpts` (object) Images directory monitor configuration. Options object as defined below:[watcherOpts](#watcheropts).

* `cropOpts` (object) Options object as defined below:[cropOpts](#cropopts).

#### watcherOpts

* `watchImgDir` (string or array of strings). Paths to files, dirs to be watched
recursively, or glob patterns.
    - Note: globs must not contain windows separators (`\`),
    because that's how they work by the standard —
    you'll need to replace them with forward slashes (`/`).
    - Note 2: for additional glob documentation, check out low-level
    library: [picomatch](https://github.com/micromatch/picomatch).

* `ignoreFiles` (string of regular expression, default: `/(^\..+)|(.+[\/\\]\..+)/`).
    - Note: Supported format: `'.jpg', '.jpeg', '.png', '.bmp', '.gif'`.

* `depth` (default: `0`). If set, limits how many levels of
subdirectories will be traversed.

#### cropOpts

* `savePath` (string). Paths to files, dirs to be saved. If not set, savePath is parent directory of original file. Subdirectory is dynamic, that named by width and height of scaleSizeList.
Naming format of subdirectory "`width`_`height`".


* `scaleSizeList` (object array). Crop the image size array.

## License

MIT