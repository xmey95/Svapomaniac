(function () {
    'use strict';

    angular
        .module('DropActionController', [])
        .controller('DropActionController', DropActionController);

    DropActionController.$inject = ['dropActionService', 'mainService', 'notifyService', '$log'];

    function DropActionController(dropActionService, mainService, notifyService, $log) {
        $log.info('DropActionController...');

        var vm = this;
        vm.what = '';
        vm.doGoto = dropActionService.doGoto;
        vm.doCopy = dropActionService.doCopy;
        vm.closeDlg = dropActionService.closeDlg;
        vm.select = function select(what){
            vm.what = what;
        };
        vm.clear = function clear(what){
            if (vm.what === what) vm.what = '';
        };
        vm.over = function over(event){
            event.originalEvent.dataTransfer.dropEffect = 'copy';
            $log.info('over', event);
        };

        var init = function init() {
        };


        notifyService
            .removeListenersForKey('OPEN_DROP_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_DROP_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_DROP_DLG_ON_HIDDEN')
            .addListener('OPEN_DROP_DLG_ON_SHOW', init);
    }


})();