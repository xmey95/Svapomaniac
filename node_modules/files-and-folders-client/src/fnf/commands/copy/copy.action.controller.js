(function () {
    'use strict';

    angular
        .module('CopyActionController', [])
        .controller('CopyActionController', CopyActionController);

    CopyActionController.$inject = ['deepSelectionService', 'copyActionService', 'notifyService', '$timeout', '$log'];

    function CopyActionController(deepSelectionService, copyActionService, notifyService, $timeout, $log) {
        $log.info('CopyActionController...');

        var vm = this;

        vm.getPossibleTargetFolders = copyActionService.getPossibleTargetFolders;
        vm.targetDir = copyActionService.getTargetDir();

        vm.optionsVisible = false;
        vm.sourceText = '';
        vm.okEnabled = false;
        vm.scanning = false;
        vm.sum = 0;

        vm.toggleOptions = function toggleOptions() {
            vm.optionsVisible = !vm.optionsVisible;
        };

        vm.setTargetDir = function setTargetDir(s) {
            vm.targetDir = s;
        };

        vm.copy = function copy() {
            copyActionService.copy(vm.targetDir);
        };

        var walkingCallback = function walkingCallback(s, sum, end) {
            $timeout(function () {
                vm.scanning = !end;
                vm.sum = sum;
                vm.sourceText = s;
                vm.okEnabled = (copyActionService.getRowsForAction());
            });
        };


        var rid;
        var init = function init() {
            vm.okEnabled = false;
            vm.sourceText = '';
            vm.scanning = false;
            vm.sum = 0;
            vm.targetDir = copyActionService.getTargetDir();

            rid = deepSelectionService.walkSelected(walkingCallback);
        };


        var cancelWalk = function cancelWalk() {
            deepSelectionService.cancelWalk(rid);
        };

        notifyService
            .removeListenersForKey('OPEN_COPY_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_COPY_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_COPY_DLG_ON_HIDDEN')
            .addListener('OPEN_COPY_DLG_ON_SHOW', init)
            .addListener('OPEN_COPY_DLG_ON_HIDDEN', cancelWalk);

    }


})();