(function () {
    'use strict';


    var fs = require('fs');
    var si = require('./systeminfo.js');
    var drive = require('./drives.js');
    var path = require('path');
    var jsonfile = require('jsonfile');
    var extend = require('extend');


    /**
     *
     * @param cb  callback(error, {
                    type: 'Windows_NT',
                    platform: 'win32',
                    arch: 'x64',
                    linux: false,
                    osx: false,
                    windows: true,
                    smartMachine: false,
                    hostname: 'DEFRAWS123456',
                    username: 'krocon',
                    homedir: 'C:\\Users\\krocon',
                    tmpdir: 'C:\\Users\\krocon\\AppData\\Local\\Temp',
                    startingPoints: ['C:', 'D:'],
                    toolsconfig: {  ... }
                })
     * @returns {*}
     */
    var getInitialLoad = function getInitialLoad(cb) {

        var loadFilePromise = function loadFilePromise(fileName) {
            return new Promise(function (resolve, reject) {
                jsonfile.readFile(fileName, function (err, json) {
                    console.info(err ? 'Not found :': 'Loaded    :', fileName);
                    resolve(json);
                });
            });
        };

        function promiseWaterfall (callbacks) {
            var first = callbacks[0]();
            return callbacks.slice(1).reduce(function (accumulator, callback) {
                return accumulator.then(callback)
            }, first);
        }

        si.getSystemInfo(function (err, systemInfo) {
            if (err) return cb(err, null);

            var fileConfig = path.join(__dirname, '../../temp', systemInfo.username + '.json');
            var fileTools = path.join(__dirname, '../../config/tool', (systemInfo.osx ? 'osx': (systemInfo.windows ? 'windows': 'linux')) + '.json');
            var fileUserDefinedTools = path.join(__dirname, '../../config/tool', systemInfo.username + '.json');
            var fileShortcuts = path.join(__dirname, '../../config/shortcut', (systemInfo.osx ? 'osx': (systemInfo.windows ? 'windows': 'linux')) + '.json');
            var fileUserDefinedShortcuts = path.join(__dirname, '../../config/shortcut', systemInfo.username + '.json');
            var fileColorDefault = path.join(__dirname, '../../config/color/light.json');
            //var fileUserDefinedColor = path.join(__dirname, '../../config/color', systemInfo.username + '.json');

            var getLoadFileFn = function (file) {
                return (function (file) {
                    return function () {
                        return loadFilePromise(file);
                    }
                })(file);
            };

            var getExtendFn = function (k) {
                return (function (key) {
                    return function (json) {
                        return new Promise(function (resolve, reject) {
                            if (json) systemInfo[key] = extend(true, systemInfo[key], json);
                            resolve(json);
                        });                    }
                })(k);
            };
            var getAssignFn = function (k) {
                return (function (key) {
                    return function (json) {
                        return new Promise(function (resolve, reject) {
                            if (json) systemInfo[key] = json;
                            resolve(json);
                        });                    }
                })(k);
            };

            var getBasenamesFn = function (dir) {
                return (function (dir) {
                    return function (json) {
                        return new Promise(function (resolve, reject) {
                            fs.readdir(dir, function (err, files) {
                                if (err) console.error(err);
                                resolve(files.map(function(f, i, arr){
                                    return path.basename(f, path.extname(f));
                                }));
                            });
                        });
                    }
                })(dir);
            };

            var getLoadColorFileFn = function () {
                return function () {
                    var style = systemInfo.config.colorname ? systemInfo.config.colorname :'light';
                    var file = path.join(__dirname, '../../config/color/' + style + '.json');
                    return loadFilePromise(file);
                }
            };

            var assignWinDrives = function(drvs){
                return new Promise(function (resolve, reject) {
                    if (!drvs) return resolve(systemInfo);

                    if (systemInfo.windows) {
                        systemInfo.startingPoints = drvs;
                        systemInfo.startingPoints.push(systemInfo.homedir);
                        return resolve(systemInfo);

                    } else if (systemInfo.osx) {
                        systemInfo.startingPoints = [
                            systemInfo.homedir,
                            '/Users'
                        ];
                        fs.readdir('/Volumes', function (err, files) {
                            if (err) return resolve(systemInfo);

                            for (var i = 0; i < files.length; i++) {
                                if (files[i] !== '.DS_Store') {
                                    systemInfo.startingPoints.push('/Volumes/' + files[i]);
                                }
                            }
                            resolve(systemInfo);
                        });
                    } else {
                        systemInfo.startingPoints = [
                            '/',
                            '/home',
                            '/dev'
                        ];
                        fs.readdir('/dev', function (err, files) {
                            if (err) return resolve(systemInfo);

                            for (var i = 0; i < files.length; i++) {
                                systemInfo.startingPoints.push('/dev/' + files[i]);
                            }
                            resolve(systemInfo);
                        });
                    }
                });
            };

            var promises = [
                getLoadFileFn(fileShortcuts),
                getExtendFn('shortcutsconfig'),

                getLoadFileFn(fileUserDefinedShortcuts),
                getExtendFn('shortcutsconfig'),

                getLoadFileFn(fileTools),
                getExtendFn('tools'),

                getLoadFileFn(fileUserDefinedTools),
                getExtendFn('tools'),

                getLoadFileFn(fileConfig),
                getExtendFn('config'),

                getLoadColorFileFn(fileColorDefault),
                getExtendFn('color'),

                // getLoadFileFn(fileColorDefault),
                // getExtendFn('color'),
                //
                // getLoadFileFn(fileUserDefinedColor),
                // getExtendFn('color'),

                getBasenamesFn(path.join(__dirname, '../../config/color')),
                getAssignFn('availableStyles'),

                drive.getWinDrivesPromise,
                assignWinDrives
            ];
            console.info('L o a d i n g   config files:');
            promiseWaterfall(promises)
            .then(function (systemInfo) {
                console.info('Loading done.');
                console.info(JSON.stringify(systemInfo, null, 4));
                cb(null, systemInfo);
            });

        });
    };


    exports.initialload = getInitialLoad;


}());



