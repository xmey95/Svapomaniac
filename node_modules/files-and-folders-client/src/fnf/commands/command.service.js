(function () {
    'use strict';

    angular
        .module('commandService', [])
        .factory('commandService', commandService);

    commandService.$inject = ['actionQueueService', 'notifyService', '$log'];

    function commandService(actionQueueService, notifyService, $log) {
        $log.info('commandService...');

        var addActions = actionQueueService.addActions;
        var actionId = 0;

        var createActionEvent = function createActionEvent(key, src, target, panelIndex, bulk) {
            return {
                id: actionId++,
                panelIndex: panelIndex,
                action: key,
                src: src,
                target: target,
                status: ret.ACTION_STATUS_NEW,
                bulk: bulk
            };
        };

        var refreshPanel = function refreshPanel(panelIndex) {
            return createActionEvent(actionQueueService.ACTION_REFRESH_PANEL, '', '', panelIndex, false);
        };

        var mkdir = function mkdir(para) {
            return createActionEvent(actionQueueService.ACTION_MKDIR, {}, {dir: para.dir, base: para.base}, para.panelIndex);
        };

        var del = function del(para) {
            var src = para.src;
            var srcPanelIndex = para.srcPanelIndex;

            if (!para.bulk) {
                notifyService.emit('update', {
                    event: 'update',
                    panelIndex: srcPanelIndex,
                    item: {dir: src.dir, base: src.base, status: 'temp'}
                });
            }
            return createActionEvent(actionQueueService.ACTION_REMOVE, src, null, srcPanelIndex, para.bulk);
        };

        var delempty = function delempty(para) {
            return createActionEvent(actionQueueService.ACTION_DELEMPTY, para.src, null, para.srcPanelIndex, false);
        };

        var copy = function copy(para) {
            var src = para.src;
            var srcPanelIndex = para.srcPanelIndex;
            var target = para.target;
            var targetPanelIndex = para.targetPanelIndex;

            if (!para.bulk && targetPanelIndex != undefined) {
                // Event verschicken, bei dem schon mal ein Platzhalter in der Target-Tabelle angezeigt wird:
                notifyService.emit('created', {
                    event: 'created',
                    panelIndex: targetPanelIndex,
                    item: {dir: target.dir, base: target.base, status: 'temp'}
                });
            }
            return createActionEvent(actionQueueService.ACTION_COPY, src, target, srcPanelIndex, para.bulk);
        };

        var move = function move(para) {
            $log.info('commandService.move()  !bulk: ', (!para.bulk));
            var src = para.src;
            var srcPanelIndex = para.srcPanelIndex;
            var target = para.target;
            var targetPanelIndex = para.targetPanelIndex;

            if (!para.bulk) {
                // Event verschicken, bei dem schon mal ein Platzhalter in der Target-Tabelle angezeigt wird:
                if (srcPanelIndex != undefined) {
                    notifyService.emit('update', {
                        event: 'update',
                        panelIndex: srcPanelIndex,
                        item: {dir: src.dir, base: src.base, status: 'temp'}
                    });
                }
                if (targetPanelIndex != undefined) {
                    notifyService.emit('created', {
                        event: 'created',
                        panelIndex: targetPanelIndex,
                        item: {dir: target.dir, base: target.base, status: 'temp'}
                    });
                }
            }
            return createActionEvent(actionQueueService.ACTION_MOVE, src, target, srcPanelIndex, para.bulk);
        };

        var rename = function rename(para) {
            $log.info('commandService.move()  !bulk: ', (!para.bulk));
            var src = para.src;
            var srcPanelIndex = para.srcPanelIndex;
            var target = para.target;

            if (!para.bulk) {
                // Event verschicken, bei dem schon mal ein Platzhalter in der Target-Tabelle angezeigt wird:
                if (srcPanelIndex != undefined) {
                    notifyService.emit('update', {
                        event: 'update',
                        panelIndex: srcPanelIndex,
                        item: {dir: src.dir, base: src.base, status: 'temp'}
                    });
                }
            }
            return createActionEvent(actionQueueService.ACTION_RENAME, src, target, srcPanelIndex, para.bulk);
        };

        var ret = {};
        ret.BULK_LOWER_LIMIT = 30;
        ret.addActions = addActions;
        ret.del = del;
        ret.delempty = delempty;
        ret.copy = copy;
        ret.move = move;
        ret.rename = rename;
        ret.mkdir = mkdir;
        ret.refreshPanel = refreshPanel;
        return ret;
    }

}());