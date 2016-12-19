(function () {
    'use strict';

    angular
        .module('gridModel', [])
        .factory('gridModelFactory', GridModelFactory);

    GridModelFactory.$inject = [];

    function GridModelFactory() {

        var GridModel = function GridModel(gridOptions) {

            var getFolderCount = function getFolderCount() {
                if (!gridOptions.api) return 0;

                var ret = 0;
                gridOptions.api.forEachNode(function (node, index) {
                    if (node.data.isDir) ret++;
                });
                return ret;
            };
            var getFileCount = function getFileCount() {
                if (!gridOptions.api) return 0;

                var ret = 0;
                gridOptions.api.forEachNode(function (node, index) {
                    if (!node.data.isDir) ret++;
                });
                return ret;
            };
            var getSizeSum = function getSizeSum() {
                if (!gridOptions.api) return 0;

                var ret = 0;
                gridOptions.api.forEachNode(function (node, index) {
                    if (node.data.size) ret = ret + node.data.size;
                });
                return ret / 1000;
            };
            var getSelectedFolderCount = function getSelectedFolderCount() {
                if (!gridOptions.api) return 0;

                var rows = gridOptions.api.getSelectedRows();
                var ret = 0;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].isDir) ret++;
                }
                return ret;
            };

            var getSizeSumText = function getSizeSumText() {
                return fileSizeSI(getSizeSum());
            };
            var getSelectedSizeSumText = function getSelectedSizeSumText() {
                return fileSizeSI(getSelectedSizeSum());
            };

            var fileSizeSI = function fileSizeSI(a, b, c, d, e) {
                //kB,MB,GB,TB,PB,EB,ZB,YB
                return (b = Math, c = b.log, d = 1e3, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes')
            };

            var getSelectedFileCount = function getSelectedFileCount() {
                if (!gridOptions.api) return 0;

                var rows = gridOptions.api.getSelectedRows();
                var ret = 0;
                for (var i = 0; i < rows.length; i++) {
                    if (!rows[i].isDir) ret++;
                }
                return ret;
            };
            var getSelectedSizeSum = function getSelectedSizeSum() {
                if (!gridOptions.api) return 0;

                var rows = gridOptions.api.getSelectedRows();
                var ret = 0;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].size) ret = ret + rows[i].size;
                }
                return ret / 1000;
            };

            var getGridOptions = function getGridOptions() {
                return gridOptions;
            };

            var ret = {};
            ret.getFolderCount = getFolderCount;
            ret.getFileCount = getFileCount;
            ret.getSizeSum = getSizeSum;
            ret.getSizeSumText = getSizeSumText;
            ret.getSelectedFolderCount = getSelectedFolderCount;
            ret.getSelectedFileCount = getSelectedFileCount;
            ret.getSelectedSizeSum = getSelectedSizeSum;
            ret.getSelectedSizeSumText = getSelectedSizeSumText;
            ret.getGridOptions = getGridOptions;

            return ret;
        };

        return {
            getInstance: function (api) {
                return new GridModel(api);
            }
        };
    }


}());