(function () {
    'use strict';

    angular
        .module('moveActionService', [])
        .factory('moveActionService', moveActionService);

    moveActionService.$inject = ['mainService', 'commandService', '$log'];

    function moveActionService(mainService, commandService, $log) {
        $log.info('moveActionService...');

        var getTargetDir = mainService.getTargetDir;
        var slash = mainService.slash;
        //var getFolderHistory = mainService.getFolderHistory;
        var getPossibleTargetFolders = mainService.getPossibleTargetFolders;
        var getRowsForAction = mainService.getRowsForAction;
        var getSourcePanelIndex = mainService.getSourcePanelIndex;
        var getTargetPanelIndex = mainService.getTargetPanelIndex;

        var move = function move(targetDirTemp) {
            var targetDir = slash(targetDirTemp);
            var actions = [];
            var rows = getRowsForAction();
            var srcPanelIndex = getSourcePanelIndex();
            var targetPanelIndex = getTargetPanelIndex();
            var i, src, target;

            for (i = 0; i < rows.length; i++) {
                src = {
                    dir: slash(rows[i].dir),
                    base: rows[i].base
                };
                target = {
                    dir: targetDir,
                    //dir: slash(rows[i].dir.replace(sourceDir, targetDir)),
                    base: rows[i].isDir ? '' : rows[i].base
                };

                actions.push(
                    commandService.move({
                        bulk: rows.length > commandService.BULK_LOWER_LIMIT,
                        src: src,
                        srcPanelIndex: srcPanelIndex,
                        target: target,
                        targetPanelIndex: targetPanelIndex
                    })
                );
            }
            actions.push(commandService.refreshPanel(srcPanelIndex));
            actions.push(commandService.refreshPanel(targetPanelIndex));

            mainService.storeLastRowIndex();
            commandService.addActions(actions);
        };

        var ret = {};
        ret.getTargetDir = getTargetDir;
        //ret.getFolderHistory = getFolderHistory;
        ret.getPossibleTargetFolders = getPossibleTargetFolders;
        ret.getRowsForAction = getRowsForAction;
        ret.move = move;
        return ret;
    }

}());