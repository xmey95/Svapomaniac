(function () {
    'use strict';

    angular
        .module('deepSelectionService', [])
        .factory('deepSelectionService', deepSelectionService);

    deepSelectionService.$inject = ['mainService', 'socketService', '$timeout', '$log'];

    function deepSelectionService(mainService, socketService, $timeout, $log) {

        $log.info('deepSelectionService...');

        var getSelectedSourceCount = mainService.getSelectedCount;
        var getFirstPossibleRow = mainService.getFirstPossibleRow;
        var getFirstItem = mainService.getFirstSelectedItem;
        var slash = mainService.slash;
        var getSelectedFiles = mainService.getSelectedFiles;
        var getSelectedFolders = mainService.getSelectedAbsoluteFolders;
        var getSelectedTableRows = mainService.getSelectedRows;
        var fileSizeSI = mainService.fileSizeSI;

        var rid = 0;
        var on = socketService.on;
        var removeListener = socketService.removeListener;
        var emit = socketService.emit;


        var cancelWalk = function cancelWalk(rid) {
            $log.info('deepSelectionService.cancelWalk', rid);
            emit('walk', {cancelled: true, rid: rid});
        };

        var walkSelected = function walkSelected(callback) {
            var selectedSourceCount = getSelectedSourceCount();
            $log.info('deepSelectionService.walkSelected...', selectedSourceCount);

            if (selectedSourceCount === 0) {
                var row = getFirstPossibleRow();
                if (row) return callback(row.base, 0, true /*end */);

                callback('nothing selected', 0, true /*end */);
            } else {
                callback((selectedSourceCount === 1) ? getFirstItem().base : (selectedSourceCount + ' files'), 1, true /*end */);
            }

            var selectedTableRows = getSelectedTableRows();

            if (selectedTableRows && selectedTableRows.length) {
                var selectedFiles = getSelectedFiles();
                var fileCount = selectedFiles.length;
                var size = 0;
                for (var i = 0; i < selectedFiles.length; i++) {
                    size =+ selectedFiles[i].size;
                }
                var folderCount = getSelectedFolders().length;

                rid++;
                var listenOn = 'walk' + rid;
                on(listenOn, function (data) {
                    if (data.base) {
                        if (data.isDir) {
                            folderCount++;
                        } else {
                            fileCount++;
                            size = size + data.size;
                        }
                        callback(
                            fileCount + ' file' + ((fileCount > 1) ? 's' : '') + ', ' +
                            folderCount + ' folder' + ((folderCount > 1) ? 's' : '') +
                            ' (' + fileSizeSI(size) + ')'
                            , (fileCount + folderCount),
                            false /*end */
                        );
                    }
                    if (data.end) {
                        removeListener(listenOn);
                        $timeout(function () {
                            if ((folderCount + fileCount) > 1) {
                                callback(
                                    fileCount + ' file' + ((fileCount > 1) ? 's' : '') + ', ' +
                                    folderCount + ' folder' + ((folderCount > 1) ? 's' : '') +
                                    ' (' + fileSizeSI(size) + ')'
                                    , (fileCount + folderCount),
                                    true /*end */
                                );
                            }
                        });
                    }
                });

                var emitMsg = {
                    pathes: getSelectedFolders(),
                    rid: rid
                };
                //var selectedFolders = getSelectedFolders();
                //if (selectedFolders.length) emitMsg.restrictions = selectedFolders;

                emit('walk', emitMsg);
                return rid;
            }
            return null;
        };

        // ---------------------------------------------

        var ret = {};

        ret.slash = slash;
        ret.walkSelected = walkSelected;
        ret.cancelWalk = cancelWalk;
        return ret;
    }

}());