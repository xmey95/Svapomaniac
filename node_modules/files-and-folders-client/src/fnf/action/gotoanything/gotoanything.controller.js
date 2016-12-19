(function () {
    'use strict';

    angular
        .module('GotoAnythingController', [])
        .controller('GotoAnythingController', GotoAnythingController);

    GotoAnythingController.$inject = ['gotoAnythingService', 'notifyService', '$timeout', '$log'];

    function GotoAnythingController(gotoAnythingService, notifyService, $timeout, $log) {
        $log.info('GotoAnythingController...');

        var vm = this;
        vm.execute = function execute() {
            gotoAnythingService.execute(vm.selected);
        };
        vm.selected = undefined;
        vm.commands = gotoAnythingService.getCommands()
    }

})();