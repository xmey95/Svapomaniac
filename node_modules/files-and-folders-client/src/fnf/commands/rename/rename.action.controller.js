(function () {
    'use strict';

    angular
        .module('RenameActionController', [])
        .controller('RenameActionController', RenameActionController);

    RenameActionController.$inject = ['renameActionService', 'notifyService', '$log'];

    function RenameActionController(renameActionService, notifyService, $log) {
        $log.info('RenameActionController...');

        var vm = this;

        vm.optionsVisible = false;
        vm.sourceText = '';
        vm.targetText = '';
        //vm.okEnabled = false;

        vm.toggleOptions = function toggleOptions() {
            vm.optionsVisible = !vm.optionsVisible;
        };

        vm.rename = function rename() {
            renameActionService.rename(vm.targetText);
        };

        //var rid;
        var init = function init() {
            $log.info('RenameActionController.init()... ' + new Date());
            vm.okEnabled = false;
            vm.sourceText = renameActionService.getSourceText();
            vm.targetText = vm.sourceText;
        };

        notifyService
            .removeListenersForKey('OPEN_RENAME_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_RENAME_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_RENAME_DLG_ON_HIDDEN')
            .addListener('OPEN_RENAME_DLG_ON_SHOW', init);
    }


})();