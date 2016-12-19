(function () {
    'use strict';

    angular
        .module('copyActionService', [])
        .factory('copyActionService', copyActionService);

    copyActionService.$inject = ['mainService', 'commandService', '$log'];

    function copyActionService(mainService, commandService, $log) {
        $log.info('copyActionService...');

        var getTargetDir = mainService.getTargetDir;
        var getSourcePanelIndex = mainService.getSourcePanelIndex;
        var getTargetPanelIndex = mainService.getTargetPanelIndex;
        var getPossibleTargetFolders = mainService.getPossibleTargetFolders;
        var slash = mainService.slash;
        //var getFolderHistory = mainService.getFolderHistory;
        var getRowsForAction = mainService.getRowsForAction;
        //var getFirstPossibleRow = mainService.getFirstPossibleRow;

        var copy = function copy(targetDirTemp) {
            var targetDir = slash(targetDirTemp);
            var actions = [];
            var rows = getRowsForAction();
            var i, src, target;

            var srcPanelIndex = getSourcePanelIndex();
            var targetPanelIndex = getTargetPanelIndex();

            for (i = 0; i < rows.length; i++) {
                src = {
                    dir: slash(rows[i].dir),
                    base: rows[i].base
                };
                target = {
                    dir: targetDir,
                    base: rows[i].base
                };
                actions.push(
                    commandService.copy({
                        bulk: rows.length > commandService.BULK_LOWER_LIMIT,
                        src: src,
                        srcPanelIndex: srcPanelIndex,
                        target: target,
                        targetPanelIndex: targetPanelIndex
                    })
                );
            }
            actions.push(commandService.refreshPanel(targetPanelIndex));
            commandService.addActions(actions);
        };

        var ret = {};
        ret.getTargetDir = getTargetDir;
        ret.getPossibleTargetFolders = getPossibleTargetFolders;
        ret.getRowsForAction = getRowsForAction;
        ret.copy = copy;
        return ret;
    }

}());