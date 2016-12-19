(function () {
    'use strict';

    angular
        .module('eventCacheFactory', [])
        .factory('eventCacheFactory', EventCacheFactory);

    EventCacheFactory.$inject = ['$log'];

    function EventCacheFactory($log) {

        var eventCache = function eventCache(callback) {
            var events = [];
            var firstTime = -1;
            var ticks = 16;
            var biggestPause = 16000;
            var timer;

            var add = function add(event) {
                var now = typeof Date.now === 'function' ? Date.now() : new Date().getTime();
                if (events.length === 0) {
                    firstTime = now;
                }
                events.push(event);
                // $log.log('add() events.length', events.length);
                if (now - firstTime > biggestPause) {
                    emmitEvents();
                } else {
                    startTimer();
                }
            };

            var startTimer = function startTimer() {
                clearTimer();
                timer = window.setTimeout(emmitEvents, ticks);
            };

            var clearTimer = function clearTimer() {
                if (timer) window.clearTimeout(timer);
                timer = null;
            };

            var emmitEvents = function emmitEvents() {
                clearTimer();
                var clone = events.slice();
                events = [];
                //$log.log('emmitEvents() clone.length', clone.length);
                callback(clone);
            };

            var ec = {};
            ec.add = add;
            return ec;
        };

        var createCache = function createCache(callback) {
            return new eventCache(callback);
        };

        // -------------------------
        var ret = {};
        ret.createCache = createCache;
        return ret;
    }

}());