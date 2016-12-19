(function () {
    'use strict';

    angular
        .module('deleteEmptyFoldersActionService', [])
        .factory('deleteEmptyFoldersActionService', deleteEmptyFoldersActionService);

    deleteEmptyFoldersActionService.$inject = ['mainService', 'commandService', '$log'];

    function deleteEmptyFoldersActionService(mainService, commandService, $log) {
        $log.info('deleteEmptyFoldersActionService...');
        var getSourcePanelIndex = mainService.getSourcePanelIndex;

        var callDeleteEmptyFolders = function callDeleteEmptyFolders(sourceDir) {
            var srcPanelIndex = getSourcePanelIndex();
            commandService.addActions([
                commandService.delempty({
                    src: {dir: sourceDir, base: ''},
                    srcPanelIndex: srcPanelIndex
                }),
                commandService.refreshPanel(srcPanelIndex)
            ]);
        };

        var ret = {};
        ret.callDeleteEmptyFolders = callDeleteEmptyFolders;
        return ret;
    }

}());