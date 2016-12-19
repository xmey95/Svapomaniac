(function () {
    'use strict';

    angular
        .module('folderService', [])
        .factory('folderService', folderService);

    folderService.$inject = ['fileSocketService', 'gridService', 'historyService', '$timeout', '$log'];

    function folderService(fileSocketService, gridService, historyService, $timeout, $log) {
        var ret = {};
        var dirs = ['', ''];
        var getGridApi = gridService.getGridApi;

        var slash = function slash(s) {
            if (!s) return '';
            return s.replace(/\\/g, '/');
        };

        var loadDirectory = function loadDirectory(panelIndex, opt, callback) {
            var api = getGridApi(panelIndex);
            if (opt.fileList) {
                api.setRowData(opt.fileList);
                //api.sizeColumnsToFit();
                dirs[panelIndex] = '';
                return;
            }

            if (!opt.path) {
                api.setRowData([]);
                dirs[panelIndex] = '';
                return;

            } else {
                historyService.addFolder(opt.path);
            }

            if (!opt.nocache && dirs[panelIndex] === opt.path) return;
            reloadDirectory(panelIndex, opt, callback);
        };

        var reloadDirectory = function reloadDirectory(panelIndex, opt, callback) {
            (function (panelIndex, opt) {
                dirs[panelIndex] = slash(opt.path);
                var api = getGridApi(panelIndex);

                fileSocketService.loadDirectory(opt, function (error, rowData) {
                    if (error) return $log.error(error);

                    $timeout(function () {
                        api.setRowData(rowData.slice(0));
                        api.sizeColumnsToFit();
                        if (callback) callback(panelIndex, opt);
                    });
                });
            })(panelIndex, opt);
        };

        var getFolderLabel = function getFolderLabel(panelIndex) {
            if (panelIndex >= dirs.length) return '?';
            return slash(dirs[panelIndex]).split('/')[0];
        };

        ret.loadDirectory = loadDirectory;
        ret.getFolderLabel = getFolderLabel;
        ret.slash = slash;
        ret.iam = 'folderService';
        return ret;
    }

}());