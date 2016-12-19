(function () {
    'use strict';

    angular
        .module('DeleteEmptyFoldersActionController', [])
        .controller('DeleteEmptyFoldersActionController', DeleteEmptyFoldersActionController);

    DeleteEmptyFoldersActionController.$inject = ['deleteEmptyFoldersActionService', 'mainService', 'notifyService', '$log'];

    function DeleteEmptyFoldersActionController(deleteEmptyFoldersActionService, mainService, notifyService, $log) {
        $log.info('DeleteEmptyFoldersActionController...');

        var vm = this;
        vm.sourceText = '';
        vm.okEnabled = false;

        vm.callDeleteEmptyFolders = function callDeleteEmptyFolders() {
            deleteEmptyFoldersActionService.callDeleteEmptyFolders(vm.sourceText);
        };

        var init = function init() {
            vm.sourceText = mainService.getSourceDir();
            vm.okEnabled = true;
        };


        notifyService
            .removeListenersForKey('OPEN_DELETE_EMPTY_FOLDERS_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_DELETE_EMPTY_FOLDERS_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_DELETE_EMPTY_FOLDERS_DLG_ON_HIDDEN')
            .addListener('OPEN_DELETE_EMPTY_FOLDERS_DLG_ON_SHOW', init);
    }


})();