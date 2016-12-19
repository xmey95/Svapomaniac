(function () {
    'use strict';

    angular
        .module('notify', [])
        .factory('notifyService', NotifyService);

    NotifyService.$inject = ['$timeout', '$log'];

    function NotifyService($timeout, $log) {
        var listeners = {};
        var ret = {};

        var $emit = function $emit(key, obj) {
            $timeout(function () {
                emit(key, obj);
            });
        };
        var emit = function emit(key, obj) {
            if (!obj) {
                obj = key;
            }
            var ls = listeners[key];
            if (ls) {
                for (var i = 0; i < ls.length; i++) {
                    ls[i](obj, key); // TODO check that ls[i] is a function
                }
            } else {
                $log.warn('notifyService: emit called for key "' + key + '" but no listeners registered yet.');
            }
            return ret;
        };

        var addListener = function addListener(key, listener) {
            if (!key) return $log.error('Error: NotifyService.addListener(key, listener): key is undefined!', key);
            if (!listeners[key]) {
                listeners[key] = [];
            }
            if (listeners[key].indexOf(listener) === -1) {
                listeners[key].push(listener);
            }
            return ret;
        };

        var removeListener = function removeListener(key, listener) {
            if (!listeners[key]) {
                return ret;
            }
            var idx = listeners[key].indexOf(listener);
            if (idx > -1) {
                listeners[key].splice(idx, 1);
            }
            return ret;
        };

        var removeListenersForKey = function removeListenersForKey(key) {
            listeners[key] = [];
            return ret;
        };

        var removeListenerForAll = function removeListenerForAll(listener) {
            for (var key in listeners) {
                if (listeners.hasOwnProperty(key)) {
                    var idx = listeners[key].indexOf(listener);
                    if (idx > -1) {
                        listeners[key].splice(idx, 1);
                    }
                }
            }
            return ret;
        };


        ret.$emit = $emit;
        ret.emit = emit;
        ret.addListener = addListener;
        ret.removeListener = removeListener;
        ret.removeListenerForAll = removeListenerForAll;
        ret.removeListenersForKey = removeListenersForKey;

        return ret;
    }

}());