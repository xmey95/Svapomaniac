(function () {
    'use strict';

    angular
        .module('dropActionService', [])
        .factory('dropActionService', dropActionService);

    dropActionService.$inject = ['mainService', 'commandService', '$log'];

    function dropActionService(mainService, commandService, $log) {
        $log.info('dropActionService...');

        var getSourcePanelIndex = mainService.getSourcePanelIndex;

        var doGoto = function doGoto(e) {
            $log.info('doGoto', e);
            // todo
            closeDlg();
        };
        var doCopy = function doCopy(e) {
            $log.info('doCopy', e);
            // todo
            closeDlg();
        };
        var closeDlg = function closeDlg(e) {
            $('button[data-dismiss="modal"]').click(); // dirty
        };

        var ret = {};
        ret.doGoto = doGoto;
        ret.doCopy = doCopy;
        ret.closeDlg = closeDlg;
        return ret;
    }

}());