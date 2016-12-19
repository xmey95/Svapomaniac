(function () {
    'use strict';

    angular
        .module('historyService', [])
        .service('historyService', historyService);

    historyService.$inject = ['dataService', '$log'];

    function historyService(dataService, $log) {
        $log.info('historyService...');

        var slash = function slash(s) {
            if (!s) return null;
            return s.replace(/\\/g, '/');
        };

        var data = dataService.getData();
        /*
         data = {
             initial: null,
             activePanelIndex: 0,
             folderHistory: [],
             data.folderLatestAdded: []
         }; */

        var addFolder = function addFolder(dir) {
            data.folderHistory.unshift(slash(dir));
            //$log.info('addFolder() data.folderHistory', data.folderHistory);

            updateFolderLatestAdded();
        };
        var updateFolderLatestAdded = function updateFolderLatestAdded() {
            // main.data.initial.startingPoints
            data.folderLatestAdded = [];
            Array.prototype.push.apply(data.folderLatestAdded, data.initial.startingPoints);

            for (var i = 0; i < data.folderHistory.length && data.folderLatestAdded.length < 15; i++) {
                var p = data.folderHistory[i];
                if (data.folderLatestAdded.indexOf(p) === -1) data.folderLatestAdded.push(p);
            }
            //$log.info('data.folderLatestAdded', data.folderLatestAdded);
        };

        var getPrevFolder = function getPrevFolder(dir) {
            dir = slash(dir);
            var idx = data.folderHistory.lastIndexOf(dir);
            if (idx < data.folderHistory.length - 1) {
                return data.folderHistory[idx + 1];
            }
            return null;
        };


        var ret = {};
        ret.addFolder = addFolder;
        ret.getPrevFolder = getPrevFolder;
        return ret;
    }

})();