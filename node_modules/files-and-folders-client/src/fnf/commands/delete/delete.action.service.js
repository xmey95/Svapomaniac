(function () {
    'use strict';

    angular
        .module('deleteActionService', [])
        .factory('deleteActionService', deleteActionService);

    deleteActionService.$inject = ['mainService', 'commandService', '$log'];

    function deleteActionService(mainService, commandService, $log) {
        $log.info('deleteActionService...');
        var getSelectedFilesAndFolders = mainService.getSelectedFilesAndFolders;
        var getSourcePanelIndex = mainService.getSourcePanelIndex;

        var callDelete = function callDelete() {
            var actions = [];
            var srcPanelIndex = getSourcePanelIndex();
            var files = getSelectedFilesAndFolders();
            for (var i = 0; i < files.length; i++) {
                actions.push(
                    commandService.del({
                        bulk: files.length > commandService.BULK_LOWER_LIMIT,
                        src: files[i],
                        srcPanelIndex: srcPanelIndex
                    })
                );
            }

            mainService.storeLastRowIndex();

            actions.push(commandService.refreshPanel(srcPanelIndex));
            commandService.addActions(actions);
        };

        var ret = {};
        ret.callDelete = callDelete;
        return ret;
    }

}());