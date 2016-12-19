(function () {
    'use strict';


    var process = require('process');
    var os = require('os');
    var exec = require('child_process').exec;
    var env = process.env;


    var systemInfo = null;
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
                    tmpdir: 'C:\\Users\\krocon\\AppData\\Local\\Temp'
                })
     * @returns {*}
     */
    var getSystemInfo = function getSystemInfo(cb) {
        if (systemInfo !== null) return cb(null, systemInfo);

        var platform = os.platform();
        var ret = {
            type: os.type(),
            platform: platform,
            arch: os.arch(),
            linux: platform.indexOf('linux') === 0,
            osx: platform === 'darwin',
            windows: platform.indexOf('win') === 0,
            smartMachine: platform === 'sunos',
            hostname: os.hostname(),
            username: env.LOGNAME || env.USER || env.LNAME || env.USERNAME,
            homedir: os.homedir().replace(/\\/g, '/'),
            tmpdir: os.tmpdir().replace(/\\/g, '/')
        };
        if (ret.username) return cb(null, ret);

        if (ret.osx || ret.linux) {
            exec('id -un', function (err, stdout) {
                ret.username = stdout.trim();
                systemInfo = ret;
                cb(err, ret);
            });
        } else if (ret.windows) {
            exec('whoami', {encoding: 'utf8'}, function (err, stdout) {
                ret.username = stdout.trim().replace(/^.*\\/, ''); // xyz\user -> user
                systemInfo = ret;
                cb(err, ret);
            });
        } else {
            systemInfo = ret;
            cb(null, ret);
        }
    };

    /**
     *
     * @returns {Promise}
     */
    function getSystemInfoPromise() {
        return new Promise(function (resolve, reject) {
            getSystemInfo(function (err, info) {
                if (err) return reject(err);
                resolve(info);
            });
        });
    }

    exports.getSystemInfo = getSystemInfo;
    exports.getSystemInfoPromise = getSystemInfoPromise;

}());



