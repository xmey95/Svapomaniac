(function () {
    'use strict';

    angular
        .module('MultirenameActionController', [])
        .controller('MultirenameActionController', MultirenameActionController);

    MultirenameActionController.$inject = ['multirenameActionService', 'notifyService', '$timeout', '$log'];

    function MultirenameActionController(multirenameActionService, notifyService, $timeout, $log) {
        $log.info('MultirenameActionController...');

        var vm = this;
        var _d = multirenameActionService.getDialogData();
        vm.data = _d.data;
        vm.options = _d.options;
        vm.multirename = multirenameActionService.multirename;
        vm.softUpdateTableModel = multirenameActionService.softUpdateTableModel;

        vm.makroSelected = function makroSelected(rep, makro) {
            rep.checked = true;
            rep.textFrom = makro.data.textFrom;
            rep.textTo = makro.data.textTo;
            rep.regExpr = makro.data.regExpr;
            rep.ifFlag = makro.data.ifFlag;
            rep.ifMatch = makro.data.ifMatch;
            vm.softUpdateTableModel();
        };

        var init = function init() {
            multirenameActionService.initTableModel();
        };

        notifyService
            .removeListenersForKey('OPEN_MULTIRENAME_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_MULTIRENAME_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_MULTIRENAME_DLG_ON_HIDDEN')
            .addListener('OPEN_MULTIRENAME_DLG_ON_SHOW', init);
    }
})();