(function(){
    'use strict';

    // Copy file from source to target.
    // See: http://stackoverflow.com/questions/34142211/fast-file-copy-with-progress-information-in-node-js

    var process = require('process');
    var os = require('os');

    var child_process = require('child_process');
    var exec = child_process.exec;
    var fse = require('fs-extra');
    var mkdirp = require('mkdirp');
    var path = require('path');
    var slash = require('./slash');

    module.exports = new Util;

    function Util(){

        var platform = os.platform();
        var osx = platform === 'darwin';

        var slash2backSlash = function slash2backSlash(s){
            return s.replace(/\//g, '\\');
        };

        var copy = function copy(psource, ptarget, callback){
            var source = slash.fixSlash(path.join(psource.dir, '/', psource.base));
            var target = slash.fixSlash(path.join(ptarget.dir, '/', ptarget.base));
            fse.stat(source, function (error, stats) {
                var sourceIsDirectory = stats.isDirectory(); // source only, target not exists!
                var targetMkdir = sourceIsDirectory ? target: ptarget.dir;

                mkdirp(targetMkdir, function(error) {
                    if (error) {
                        console.error('error', error);
                        return callback(error);
                    }

                    var cmd;
                    if (osx) {
                        // cp -r "/Users/marc/__test/src/DUDEN Deutsch 3. Klasse - Lernkalender.pdf" "/Users/marc/__test/target"
                        // cp -r "/Users/marc/__test/src/a" "/Users/marc/__test/target"
                        cmd = ('cp -r "' + source + '" "' + ptarget.dir + '"');
                    } else {
                        if (sourceIsDirectory) {
                            // xcopy  "C:\Users\kronmar\bbbbb\marc\a" "C:\Users\kronmar\bbbbb\marc2\a\" /E /C /I /H /R /Y
                            cmd = ('xcopy  "' + slash2backSlash(source) + '" "' + slash2backSlash(ptarget.dir + '/' + psource.base + '/')) + '" /E /C /I /H /R /Y ';
                        } else {
                            // xcopy  "C:\Users\kronmar\bbbbb\marc\zipEntries.js" "C:\Users\kronmar\bbbbb\marc2" /Y
                            cmd = ('xcopy  "' + slash2backSlash(source) + '" "' + slash2backSlash(ptarget.dir)) + '" /Y ';
                        }
                    }
                    console.info('cmd', cmd);

                    exec(cmd, function (error, stdout, stderr) {

                        if (error) {
                            fse.copy(source, target, function (error) {
                                callback(error, {
                                    source: source,
                                    target: target
                                });
                            });

                        } else {

                            callback(error, {
                                source: source,
                                target: target,
                                cmd: cmd,
                                stdout: stdout,
                                stderr: stderr
                            });
                        }
                    });
                });
            });
        };


        var move = function move(psource, ptarget, callback) {
            var source = slash.fixSlash(path.join(psource.dir, '/', psource.base));
            var target = slash.fixSlash(path.join(ptarget.dir, '/', ptarget.base));
            console.info('source', source);
            console.info('target', target);

            fse.stat(source, function (error, stats) {
                var sourceIsDirectory = stats.isDirectory(); // source only, target not exists!
                var targetMkdir = sourceIsDirectory ? target: ptarget.dir;

                mkdirp(targetMkdir, function(error) {
                    if (error) {
                        console.error('error', error);
                        return callback(error);
                    }

                    var cmd;
                    var t = target;
                    if (osx) {
                        // cmd mv "/Users/marc/__test/src/a" "/Users/marc/__test/target"
                        // cmd mv "/Users/marc/__test/src/DUDEN Deutsch 3. Klasse - Lernkalender.pdf" "/Users/marc/__test/target"
                        cmd = ('mv "' + source + '" "' + ptarget.dir + '"');
                    } else {
                        // move /Y "C:\Users\kronmar\bbbbb\marc\a" "C:\Users\kronmar\bbbbb\marc2\"
                        // move /Y "C:\Users\kronmar\bbbbb\marc\zipEntries.js" "C:\Users\kronmar\bbbbb\marc2\"
                        cmd = ('move /Y "' + slash2backSlash(source) + '" "' + slash2backSlash(ptarget.dir) + '"');
                    }
                    console.info('cmd', cmd);

                    exec(cmd, function (error, stdout, stderr) {
                        if (error) {
                            if (error) console.error(error);
                            console.info('fse.move() : ', source, target);
                            fse.move(source, target, function (error) {
                                callback(error, {
                                    source: source,
                                    target: target
                                });
                            });
                        } else {
                            callback(error, {
                                source: source,
                                target: target,
                                cmd: cmd,
                                stdout: stdout,
                                stderr: stderr
                            });
                        }
                    });

                });
            });
        };

        var ret = {};
        ret.move = move;
        ret.copy = copy;
        ret.slash = slash;

        return ret;
    }
})();

