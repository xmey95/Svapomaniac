(function () {
    'use strict';

    angular
        .module('groupfilesTableService', [])
        .factory('groupfilesTableService', groupfilesTableService);

    groupfilesTableService.$inject = ['mainService', '$log'];

    function groupfilesTableService(mainService, $log) {
        $log.info('groupfilesTableService...');

        var getTargetDir = mainService.getTargetDir;
        var getSourceDir = mainService.getSourceDir;

        var updateTableModelFirstLetter = function updateTableModelFirstLetter(para, selectedFiles) {
            var rows = [];
            var i;
            var groups = [];
            var targetDir = para.useSsourceDir ? getSourceDir() : getTargetDir();
            var groupCount = 0;
            var idx = 0;

            var twoLetters = para.twoLetters;
            var letterCount = twoLetters ? 2 : 1;

            for (i = 0; i < selectedFiles.length; i++) {
                var file = selectedFiles[i];
                var dir = file.base;
                if (para.ignoreBrackets) {
                    dir = dir
                        .replace(/\[[\w\d\s]+\]/g, '')
                        .replace(/\([\w\d\s]+\)/g, '');
                }
                dir = dir
                    .replace(/(^[\s_-]+|[\s_-]+$)/g, '')
                    .substr(0, letterCount);

                if (para.lower) dir = dir.toLowerCase();
                if (para.upper) dir = dir.toUpperCase();

                if (dir) {
                    if (groups.indexOf(dir) === -1) groups.push(dir);
                    rows.push({
                        id: idx++,
                        base: file.base,
                        src: file,
                        dir: dir,
                        target: {
                            dir: targetDir + '/' + dir,
                            base: file.base
                        }
                    });
                }
            }
            return {
                groupCount: groups.length,
                rows : rows
            };
        };

        var updateTableModelMinusSeparator = function updateTableModelMinusSeparator(para, selectedFiles) {
            var rows = [];
            var i, m;
            var groups = {};
            var minGroupSize = para.minsize;
            var targetDir = para.useSsourceDir ? getSourceDir() : getTargetDir();
            var groupCount = 0;
            var idx = 0;

            for (i = 0; i < selectedFiles.length; i++) {
                var file = selectedFiles[i];
                var name = file.base;
                var folder = null;
                if (para.ignoreBrackets) {
                    name = name
                        .replace(/\[[^\]]+\]/g, '')
                        .replace(/\([^\)]+\)/g, '');
                }
                m = name.match(/(.+) - (.+)/);
                if (m) {
                    folder = m[1];
                } else {
                    m = name.match(/(.+)-(.+)/);
                    if (m) {
                        folder = m[1];
                    }
                }

                if (folder) {
                    folder = folder.replace(/(^[\.\s_-]+|[\.\s_-]+$)/g, '');
                    if (!groups[folder]) groups[folder] = [];
                    groups[folder].push(file);
                }
            }

            for (var dir in groups) {
                if (groups.hasOwnProperty(dir)) {
                    var files = groups[dir];

                    if (files.length >= minGroupSize) {
                        groupCount++;
                        for (i = 0; i < files.length; i++) {
                            var f = files[i];
                            rows.push({
                                id: idx++,
                                base: f.base,
                                src: f,
                                dir: dir,
                                target: {
                                    dir: targetDir + '/' + dir,
                                    base: f.base
                                }
                            });
                        }
                    }
                }
            }

            return {
                groupCount: groupCount,
                rows : rows
            };
        };

        var updateTableModelFirstWord = function updateTableModelFirstWord(para, selectedFiles) {
            var rows = [];
            var i, m;
            var groups = {};
            var minGroupSize = para.minsize;
            var targetDir = para.useSsourceDir ? getSourceDir() : getTargetDir();
            var groupCount = 0;
            var idx = 0;

            for (i = 0; i < selectedFiles.length; i++) {
                var file = selectedFiles[i];
                var name = file.base;
                var folder = null;
                if (para.ignoreBrackets) {
                    name = name
                        .replace(/\[[^\]]+\]/g, '')
                        .replace(/\([^\)]+\)/g, '');
                }
                m = name.match(/(\w+)\W(.+)/);
                if (m) {
                    folder = m[1];
                }

                try {
                    if (folder) {
                        folder = folder.replace(/(^[\.\s_-]+|[\.\s_-]+$)/g, '');
                        if (!groups[folder]) groups[folder] = [];
                        groups[folder].push(file);
                    }
                } catch (e) {
                    $log.warn(e);
                    $log.warn('m', m);
                    $log.warn('can set property "' + folder + '"!');
                }
            }

            for (var dir in groups) {
                if (groups.hasOwnProperty(dir)) {
                    var files = groups[dir];

                    if (files.length >= minGroupSize) {
                        groupCount++;
                        for (i = 0; i < files.length; i++) {
                            var f = files[i];
                            rows.push({
                                id: idx++,
                                base: f.base,
                                src: f,
                                dir: dir,
                                target: {
                                    dir: targetDir + '/' + dir,
                                    base: f.base
                                }
                            });
                        }
                    }
                }
            }
            return {
                groupCount: groupCount,
                rows : rows
            };            
        };

        var updateTableModelRunningNumber = function updateTableModelRunningNumber(para, selectedFiles) {
            var rows = [];
            var i;
            var groups = {};
            var minGroupSize = para.minsize;
            var targetDir = para.useSsourceDir ? getSourceDir() : getTargetDir();
            var groupCount = 0;
            var idx = 0;

            for (i = 0; i < selectedFiles.length; i++) {
                var file = selectedFiles[i];
                var name = file.base;

                if (para.ignoreBrackets) {
                    name = name
                        .replace(/\[[^\]]+\]/g, '')
                        .replace(/\([^\)]+\)/g, '');
                    //console.info('out) "'+folder+'"');
                }

                var digits = name.match(/(\d)+/g);
                var words = name.match(/(\D)+/g);

                if (digits && digits.length >= 1 && words && words.length >= 2) {

                    var folder = words[0];
                    //console.info('in ) "'+folder+'"');
                    folder = folder
                        .replace(/#/g, '')
                        .replace(/ Band /g, '')
                        .replace(/'/g, '')
                        .replace(/(^[\.\s_-]+|[\.\s_-]+$)/g, '');

                    if (folder) {
                        if (!groups[folder]) groups[folder] = [];
                        groups[folder].push(file);
                    }
                }
            }

            for (var dir in groups) {
                if (groups.hasOwnProperty(dir)) {
                    var files = groups[dir];

                    if (files.length >= minGroupSize) {
                        groupCount++;
                        for (i = 0; i < files.length; i++) {
                            var f = files[i];
                            rows.push({
                                id: idx++,
                                base: f.base,
                                src: f,
                                dir: dir,
                                target: {
                                    dir: targetDir + '/' + dir,
                                    base: f.base
                                }
                            });
                        }
                    }
                }
            }
            return {
                groupCount: groupCount,
                rows : rows
            };            
        };

        var updateTableModelNewFolder = function updateTableModelNewFolder(para, selectedFiles) {
            var rows = [];
            var i;
            var targetDir = para.useSsourceDir ? getSourceDir() : getTargetDir();
            var dir = para.newFolder;

            if (dir) {
                for (i = 0; i < selectedFiles.length; i++) {
                    var f = selectedFiles[i];
                    rows.push({
                        id: i,
                        base: f.base,
                        src: f,
                        dir: dir,
                        target: {
                            dir: targetDir + '/' + dir,
                            base: f.base
                        }
                    });
                }
            }
            return {
                groupCount: 1,
                rows : rows
            };
        };


        var updateTableModel = function updateTableModel(para, selectedFiles) {
            if (para.modus === 'new_folder') {
                return updateTableModelNewFolder(para, selectedFiles);
            }
            if (para.modus === 'runnig_number') {
                return updateTableModelRunningNumber(para, selectedFiles);
            }
            if (para.modus === 'minus_separator') {
                return updateTableModelMinusSeparator(para, selectedFiles);
            }
            if (para.modus === 'first_word') {
                return updateTableModelFirstWord(para, selectedFiles);
            }
            if (para.modus.indexOf('letter') > -1) {
                para.lower = para.modus.indexOf('lower') > -1;
                para.upper = para.modus.indexOf('upper') > -1;
                para.twoLetters = para.modus.indexOf('two') > -1;

                return updateTableModelFirstLetter(para, selectedFiles);
            }

            $log.warn('updateTableModel. Unknown mode:', para.modus);
            return {
                groupCount: 0,
                rows : []
            };
        };


        var ret = {};
        ret.updateTableModel = updateTableModel;
        return ret;
    }

}());