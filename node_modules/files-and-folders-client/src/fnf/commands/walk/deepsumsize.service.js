(function () {
    'use strict';

    angular
        .module('deepSumSizeService', [])
        .factory('deepSumSizeService', deepSumSizeService);

    deepSumSizeService.$inject = ['mainService', 'socketService', '$timeout', '$log'];

    function deepSumSizeService(mainService, socketService, $timeout, $log) {
        $log.info('deepSumSizeService...');

        var getSourceGridApi = mainService.getSourceGridApi;
        var getFocusedRow = mainService.getFocusedRow;
        var on = socketService.on;
        var removeListener = socketService.removeListener;
        var emit = socketService.emit;
        var rid = 0;

        // not used at the moment:
        var cancelWalk = function cancelWalk(rid) {
            $log.info('deepSumSizeService.cancelWalk', rid);
            emit('walksum', {cancelled: true, rid: rid});
        };

        var calcSumsForSelectedRow = function calcSumsForSelectedRow() {
            var row = getFocusedRow();
            if (row && row.isDir) {
                var gridApi = getSourceGridApi();
                row.size = 0;
                if (row.isWalking) return;

                rid++;
                var listenOn = 'walksum' + rid;
                var lastUpdate = Date.now();
                on(listenOn, function (data) {
                    if (data.size) {
                        row.size = row.size + data.size;

                        if (Date.now() - lastUpdate > 1000) {
                            lastUpdate = Date.now();
                            gridApi.softRefreshView();
                        }
                    }
                    if (data.end) {
                        removeListener(listenOn);
                        $timeout(function () {
                            row.isWalking = false;
                            gridApi.softRefreshView();
                        });
                    }
                }); 
                var emitMsg = {
                    dir: row.dir + '/' + row.base,
                    rid: rid
                };
                row.isWalking = true;
                emit('walksum', emitMsg);
                return rid;
            }
            return null;
        };

        var ret = {};
        ret.calcSumsForSelectedRow = calcSumsForSelectedRow;
        ret.cancelWalk = cancelWalk;
        return ret;
    }

}());