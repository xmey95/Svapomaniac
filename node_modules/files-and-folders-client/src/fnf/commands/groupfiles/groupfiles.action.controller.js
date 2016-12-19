(function () {
    'use strict';

    angular
        .module('GroupfilesActionController', [])
        .controller('GroupfilesActionController', GroupfilesActionController);

    GroupfilesActionController.$inject = ['groupfilesActionService', 'notifyService', '$log'];

    function GroupfilesActionController(groupfilesActionService, notifyService, $log) {
        $log.info('GroupfilesActionController...');

        var vm = this;
        vm.data = groupfilesActionService.getDialogData();

        vm.updateTableModel = function updateTableModel() {
            vm.data.groupCount = groupfilesActionService.updateTableModel({
                modus: vm.data.modus,
                minsize: parseInt(vm.data.minsize),
                ignoreBrackets: vm.data.ignoreBrackets,
                newFolder: vm.data.newFolder,
                useSsourceDir: vm.data.useSsourceDir
            });
            vm.data.okEnabled = vm.data.groupCount > 0;
        };

        vm.move = groupfilesActionService.move;
        vm.copy = groupfilesActionService.copy;

        var init = function init() {
            $log.info('init()...');
            vm.updateTableModel();
        };

        notifyService
            .removeListenersForKey('OPEN_GROUPFILES_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_GROUPFILES_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_GROUPFILES_DLG_ON_HIDDEN')
            .addListener('OPEN_GROUPFILES_DLG_ON_SHOW', init);
        //.addListener('OPEN_GROUPFILES_DLG_ON_HIDDEN', cancelWalk);
    }

})();