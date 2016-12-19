(function () {
    'use strict';

    var spawn = require('child_process').spawn;
    var os = require('os');

    var getWinDrives = function getWinDrives(callback) {
        if (os.platform().indexOf('win') !== 0) return callback(null, []); // for windows only.

        var stdout = '';
        var list = spawn('cmd');

        list.stdout.on('data', function (data) {
            stdout += data;
        });

        list.stderr.on('data', function (data) {
            console.error('stderr: ' + data);
        });

        list.on('exit', function (code) {
            if (code == 0) {
                var data = stdout.split('\r\n');
                data = data.splice(4, data.length - 7);
                data = data.map(Function.prototype.call, String.prototype.trim);
                callback(null, data);
            } else {
                callback(code, null);
            }
        });
        list.stdin.write('wmic logicaldisk get caption\n');
        list.stdin.end();
    };

    /**
     *
     * @returns {Promise}
     */
    function getWinDrivesPromise() {
        return new Promise(function (resolve, reject) {
            getWinDrives(function (err, info) {
                //if (err) return reject(err);
                if (err) console.info(err);
                resolve(info);
            });
        });
    }

    exports.getWinDrives = getWinDrives;
    exports.getWinDrivesPromise = getWinDrivesPromise;

})();