(function () {
    'use strict';

    var fs = require('fs-extra');
    var path = require('path');
    var slash = require('./slash');


    var emitEventRemoved = function emitEventRemoved(socket, action) {
        socket.emit(action.cmd + action.id, {
            events: [
                {
                    event: 'removed',
                    panelIndex: action.panelIndex,
                    item: action.src
                }
            ]
        });
    };
    var emitEventCreated = function emitEventCreated(socket, action, postevents) {
        if (!socket) return console.warn('No socket given');

        var target = slash.fixSlash(path.join(action.target.dir, '/', action.target.base));
        fs.stat(target, function (error, stats) {
            if (error) return socket.emit(action.cmd + action.id, {events: [], error: error});

            var ev = {
                event: 'created',
                panelIndex: Math.abs(action.panelIndex - 1),
                item: {dir: action.target.dir, base: action.target.base}
            };
            if (stats) {
                ev.item.size = stats.isDirectory() ? null : stats.size;
                ev.item.date = stats.atime;
                ev.item.isDir = stats.isDirectory();
            }
            var events = [ev];
            if (postevents && postevents.length) {
                for (var i = 0; i < postevents.length; i++) {
                    events.push(postevents[i]);
                }
            }
            socket.emit(action.cmd + action.id, {
                events: events,
                error: error
            });
        });
    };

    var createEventUnselect = function createEventUnselect(action) {
        return {
            event: 'unselect',
            panelIndex: action.panelIndex,
            item: {dir: action.src.dir, base: action.src.base}
        }
    };

    var createEventRemoved = function createEventRemoved(action) {
        return {
            event: 'removed',
            panelIndex: action.panelIndex,
            item: {dir: action.src.dir, base: action.src.base}
        }
    };

    var createEventFocusTarget = function createEventFocusTarget(action) {
        return {
            event: 'focus',
            panelIndex: action.panelIndex,
            item: {
                dir: action.target.dir,
                base: slash.fixSlash(action.target.base)
            }
        }
    };


    var ret = {};
    ret.emitEventRemoved = emitEventRemoved;
    ret.emitEventCreated = emitEventCreated;
    ret.createEventUnselect = createEventUnselect;
    ret.createEventRemoved = createEventRemoved;
    ret.createEventFocusTarget = createEventFocusTarget;
    module.exports = ret;

})();