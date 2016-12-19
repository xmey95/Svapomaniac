(function () {
    'use strict';

    angular
        .module('filesocket', [])
        .factory('fileSocketService', FileSocketService);

    FileSocketService.$inject = ['socketService', '$log'];

    function FileSocketService(socketService, $log) {
        var rid = 0;
        var on = socketService.on;
        var emit = socketService.emit;
        var removeListener = socketService.removeListener;

        var loadDirectory = function loadDirectory(opt, callback) {
            (function (opt, rid) {
                var p = opt.path;
                var rowData = [];
                var listenOn = 'dir' + rid;
                on(listenOn, function (data) {
                    if (data.begin) {
                        rowData = [];
                    }
                    if (data.base) {
                        rowData.push(data);
                    }
                    if (data.end) {
                        removeListener(listenOn);
                        callback(null, rowData);
                    }
                });
                emit('dir', {path: p, rid: rid, nocache: opt.nocache});
            })(opt, ++rid);
        };

        var initialLoad = function initialLoad(callback) {
            if (!callback) throw Error('initialLoad(callback): callback is null.');

            on('initialload', function (data) {
                callback(data);
                removeListener('initialload');
            });
            emit('initialload');
        };

        var ret = {};
        ret.loadDirectory = loadDirectory;
        ret.initialLoad = initialLoad;

        return ret;
    }

}());