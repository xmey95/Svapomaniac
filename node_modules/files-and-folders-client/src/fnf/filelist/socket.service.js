(function () {
    'use strict';

    angular
        .module('socket', [])
        .factory('socketService', SocketService);

    SocketService.$inject = ['$log', '$rootScope'];

    function SocketService($log, $rootScope) {
        var socket = io.connect();
        $log.info('SocketService...', socket);

        var removeListener = socket.removeListener;
        //var on = socket.on;
        //var emit = socket.emit;
        var on = function (eventName, callback) {
            socket.on(eventName, function () {
                callback.apply(socket, arguments);
            });
        };
        var emit = function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                if (callback) callback.apply(socket, arguments);
            })
        };

        //var $on = function $on(eventName, callback) {
        //    socket.on(eventName, function () {
        //        var args = arguments;
        //        $rootScope.$apply(function () {
        //            callback.apply(socket, args);
        //        });
        //    });
        //};
        //
        //var $emit = function $emit(eventName, data, callback) {
        //    socket.emit(eventName, data, function () {
        //        var args = arguments;
        //        $rootScope.$apply(function () {
        //            if (callback) callback.apply(socket, args);
        //        });
        //    })
        //};


        var ret = {};
        ret.removeListener = removeListener;
        ret.on = on;
        ret.emit = emit;
        //ret.$on = $on;
        //ret.$emit = $emit;

        return ret;
    }

}());