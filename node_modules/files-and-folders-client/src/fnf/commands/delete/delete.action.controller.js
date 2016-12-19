(function () {
    'use strict';

    angular
        .module('DeleteActionController', [])
        .controller('DeleteActionController', DeleteActionController);

    DeleteActionController.$inject = ['deepSelectionService', 'deleteActionService', 'notifyService', '$timeout', '$log'];

    function DeleteActionController(deepSelectionService, deleteActionService, notifyService, $timeout, $log) {
        $log.info('DeleteActionController...');

        var vm = this;
        vm.sourceText = '';
        vm.okEnabled = false;
        vm.scanning = false;
        vm.sum = 0;

        vm.callDelete = function callDelete() {
            deleteActionService.callDelete();
        };

        var walkingCallback = function walkingCallback(s, sum, end) {
            $timeout(function () {
                vm.scanning = !end;
                vm.sum = sum;
                vm.sourceText = s;
                //if (sum)
                vm.okEnabled = true;
            });
        };

        var rid;
        var init = function init() {
            vm.sourceText = '';
            vm.okEnabled = false;
            vm.scanning = false;
            vm.sum = 0;
            rid = deepSelectionService.walkSelected(walkingCallback);
        };


        var cancelWalk = function cancelWalk() {
            deepSelectionService.cancelWalk(rid);
        };

        notifyService
            .removeListenersForKey('OPEN_DELETE_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_DELETE_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_DELETE_DLG_ON_HIDDEN')
            .addListener('OPEN_DELETE_DLG_ON_SHOW', init)
            .addListener('OPEN_DELETE_DLG_ON_HIDDEN', cancelWalk);
    }


})();