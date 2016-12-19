(function () {
    'use strict';

    angular
        .module('MkdirActionController', [])
        .controller('MkdirActionController', MkdirActionController);

    MkdirActionController.$inject = ['mkdirActionService', 'notifyService', '$log'];

    function MkdirActionController(mkdirActionService, notifyService, $log) {
        $log.info('MkdirActionController...');

        var vm = this;
        vm.name = '';
        vm.targetDir = '';
        vm.okEnabled = false;

        vm.setTargetDirTemp = function setTargetDirTemp(s) {
            vm.targetDirTemp = s;
        };

        var slash = function slash(s) {
            if (!s) return null;
            return s.replace(/\\/g, '/');
        };

        var init = function init() {
            $log.info('MkdirActionController.init()... ' + new Date());
            vm.okEnabled = false;
            vm.targetDir = mkdirActionService.getSourceDir();
            vm.name = mkdirActionService.getInitName();
        };

        vm.mkdir = function mkdir() {
            mkdirActionService.mkdir(vm.targetDir, vm.name);
        };

        notifyService.removeListenersForKey('OPEN_MKDIR_DLG_ON_SHOW');
        notifyService.addListener('OPEN_MKDIR_DLG_ON_SHOW', init);
    }
})();