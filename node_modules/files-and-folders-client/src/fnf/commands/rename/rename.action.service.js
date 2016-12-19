(function () {
    'use strict';

    angular
        .module('renameActionService', [])
        .factory('renameActionService', renameActionService);

    renameActionService.$inject = ['mainService', 'commandService', '$log'];

    function renameActionService(mainService, commandService, $log) {
        $log.info('renameActionService...');

        var getSourcePanelIndex = mainService.getSourcePanelIndex;

        var row;
        var getSourceText = function getSourceText() {
            row = mainService.getFirstSelectedItem();
            if (row) return row.base;
            return '';
        };

        var rename = function rename(targetText) {
            var srcPanelIndex = getSourcePanelIndex();
            var actions = [];
            actions.push(
                commandService.rename({
                    bulk: false,
                    src: {
                        dir: row.dir,
                        base: row.base
                    },
                    srcPanelIndex: srcPanelIndex,
                    target: {
                        dir: row.dir,
                        base: targetText
                    },
                    targetPanelIndex: srcPanelIndex
                })
            );
            actions.push(commandService.refreshPanel(srcPanelIndex));

            // TODO das reicht hier nicht. wir wollen den neuen Namen selectieren! mainService.storeLastRowIndex();
            mainService.storeLastRowIndex();
            commandService.addActions(actions);
        };

        var ret = {};
        ret.getSourceText = getSourceText;
        ret.rename = rename;
        return ret;
    }

}());