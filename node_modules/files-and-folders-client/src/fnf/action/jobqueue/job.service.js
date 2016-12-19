(function () {
    'use strict';

    angular
        .module('jobService', [])
        .factory('jobService', JobService);

    JobService.$inject = ['jobQueueGridOptionsFactory', 'actionQueueService', 'notifyService', '$timeout', '$log'];

    function JobService(jobQueueGridOptionsFactory, actionQueueService, notifyService, $timeout, $log) {
        $log.info('jobService...');

        var gridOptions = jobQueueGridOptionsFactory.getOptions();
        var queueData = actionQueueService.getQueue(0);

        var next = actionQueueService.next;
        var getQueueStatus = actionQueueService.getQueueStatus;

        var restartVisible = function restartVisible(){
            return getQueueStatus(0) === actionQueueService.QUEUE_STATUS_ERROR;
        };

        gridOptions.rowData = queueData.actions;

        var getGridOptions = function getGridOptions() {
            //$log.info('gridOptions.rowData', gridOptions.rowData);
            return gridOptions;
        };

        var cancel = null;

        var triggerRefreshGui = function triggerRefreshGui() {
            if (cancel !== null) $timeout.cancel(cancel);
            cancel = $timeout(refreshGui, 1234);
        };

        var refreshGui = function refreshGui() {
            $log.info('gridOptions', gridOptions);
            if (gridOptions.api) {
                gridOptions.api.setRowData(queueData.actions);
                gridOptions.api.refreshView();
            }
        };

        notifyService.addListener(actionQueueService.REFRESH_JOB_QUEUE_TABLE, triggerRefreshGui);

        refreshGui();

        var ret = {};
        ret.getQueueStatus = getQueueStatus;
        ret.getGridOptions = getGridOptions;
        ret.next = next;
        ret.restartVisible = restartVisible;
        return ret;
    }

}());