(function () {
    'use strict';

    angular
        .module('app')
        .service('dataService', DataService);

    DataService.$inject = ['$log'];

    function DataService($log) {
        $log.info('dataService...');

        var data = {
            initial: null,
            activePanelIndex: 0,
            tools: [],
            folderHistory: [],
            folderLatestAdded: [],
            favs: [],
            shortcutsconfig: null,
            color: null
        };

        var getData = function getData() {
            return data;
        };

        var setInitialLoad = function setInitialLoad(d) {
            data.initial = d;
            $log.info('dataService.setInitialLoad() / data', data);
            $log.info('dataService.setInitialLoad() / data.initial', data.initial);
        };

        var ret = {};
        ret.getData = getData;
        ret.setInitialLoad = setInitialLoad;
        return ret;
    }

})();