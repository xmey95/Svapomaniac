(function () {
    'use strict';

    angular
        .module('MoveActionController', [])
        .controller('MoveActionController', MoveActionController);

    MoveActionController.$inject = ['deepSelectionService', 'moveActionService', 'notifyService', '$timeout', '$log'];

    function MoveActionController(deepSelectionService, moveActionService, notifyService, $timeout, $log) {
        $log.info('MoveActionController...');

        var vm = this;

        vm.getPossibleTargetFolders = moveActionService.getPossibleTargetFolders;
        vm.targetDir = moveActionService.getTargetDir();

        vm.optionsVisible = false;
        vm.sourceText = '';
        vm.sourceFiles = [];
        vm.okEnabled = false;

        vm.toggleOptions = function toggleOptions() {
            vm.optionsVisible = !vm.optionsVisible;
        };

        vm.move = function move() {
            moveActionService.move(vm.targetDir);
        };

        vm.setTargetDir = function setTargetDir(f){
            vm.targetDir = f;
        };

        var walkingCallback = function walkingCallback(s, sum, end) {
            $timeout(function () {
                vm.scanning = !end;
                vm.sum = sum;
                vm.sourceText = s;
                vm.okEnabled = (moveActionService.getRowsForAction());
            });
        };

        var rid;
        var init = function init() {
            $log.info('MoveActionController.init()... ' + new Date());
            vm.okEnabled = false;
            vm.sourceText = '';
            vm.targetDir = moveActionService.getTargetDir();

            rid = deepSelectionService.walkSelected(walkingCallback);
        };


        var cancelWalk = function cancelWalk() {
            deepSelectionService.cancelWalk(rid);
        };

        notifyService
            .removeListenersForKey('OPEN_MOVE_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_MOVE_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_MOVE_DLG_ON_HIDDEN')
            .addListener('OPEN_MOVE_DLG_ON_SHOW', init)
            .addListener('OPEN_MOVE_DLG_ON_HIDDEN', cancelWalk);

    }


})();