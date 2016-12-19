(function () {
    'use strict';

    angular
        .module('shellActionService', [])
        .factory('shellActionService', shellActionService);

    shellActionService.$inject = ['socketService', '$log'];

    function shellActionService(socketService, $log) {
        $log.info('shellActionService...');

        var execute = function execute(cmds) {
            $log.info('shellActionService.execute()', cmds);
            socketService.emit('shell', cmds, function (error, d) {
                if (error) $log.error(error);
            });
        };

        var ret = {};
        ret.execute = execute;
        return ret;
    }

}());