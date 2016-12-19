(function () {
    'use strict';

    angular
        .module('JobQueueController', [])
        .controller('JobQueueController', JobQueueController);

    JobQueueController.$inject = ['jobService',  '$log'];

    function JobQueueController(jobService, $log) {
        $log.info('JobQueueController...');

        var vm = this;
        vm.gridOptions = jobService.getGridOptions();
        vm.restartVisible = jobService.restartVisible;
        vm.next = jobService.next;
        vm.getQueueStatus = jobService.getQueueStatus;
    }


})();