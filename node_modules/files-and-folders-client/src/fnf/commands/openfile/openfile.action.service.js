(function () {
    'use strict';

    angular
        .module('openfileActionService', [])
        .factory('openfileActionService', openfileActionService);

    openfileActionService.$inject = ['socketService', '$log'];

    function openfileActionService(socketService, $log) {
        $log.info('openfileActionService...');

        var openFile = function openFile(file) {
            socketService.emit('open', file, function (error, d) {
                if (error) $log.error(error);
            });
        };

        var ret = {};
        ret.openFile = openFile;
        return ret;
    }

}());