(function () {
    'use strict';

    angular
        .module('searchService', [])
        .factory('searchService', searchService);

    searchService.$inject = ['socketService', '$log'];


    function searchService(socketService, $log) {
        var rid = 0;
        var on = socketService.on;
        var removeListener = socketService.removeListener;
        var emit = socketService.emit;

        var init = function init() {
            $log.info('searchService init...');
        };

        var cancelSearch = function cancelSearch(rid) {
            // $log.info('searchService.cancelWalk', rid);
            emit('search', {cancelled: true, rid: rid});
        };

        var search = function search(filter, callback) {
            var pathes = filter.pathes;

            if (!pathes || pathes.length === 0) {
                callback('Folder is missing', 0, true /*end */);
            }

            rid++;
            var listenOn = 'search' + rid;
            on(listenOn, function (data) {
                if (data.base) {
                    callback(data, false /*end */);
                }
                if (data.end) {
                    removeListener(listenOn);
                    callback(null, true /*end */);
                }
            });

            emit('search', {
                filter: filter,
                rid: rid
            });
            return rid;
        };
        // ---------------------------------------------

        var ret = {};
        ret.init = init;
        ret.search = search;
        ret.cancelSearch = cancelSearch;
        return ret;
    }

}());