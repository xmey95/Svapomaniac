(function () {
    'use strict';

    angular
        .module('executorFactory', [])
        .factory('executorFactory', ExecutorFactory);

    ExecutorFactory.$inject = ['socketService', '$log'];

    function ExecutorFactory(socketService, $log) {

        var id = 0;

        var Executor = function Executor(action, id) {
            var ret = {};

            var getAction = function getAction() {
                return action;
            };

            var execute = function execute(callback) {
                var eventName = action.action.toLowerCase();
                action.id = id;
                var listenOn = eventName + action.id;
                $log.info('Executor.executing ', listenOn);
                socketService.on(listenOn, function (data) {
                    socketService.removeListener(listenOn);
                    $log.info('Executor.done      ', listenOn);
                    callback(data.error, data.events);
                });
                socketService.emit(eventName, action);
            };

            ret.execute = execute;
            ret.getAction = getAction;
            return ret;
        };

        var create = function create(action) {
            return new Executor(action, id++);
        };


        var self = {};
        self.create = create;
        return self;
    }


}());