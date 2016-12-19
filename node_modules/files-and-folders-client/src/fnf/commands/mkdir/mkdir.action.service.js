(function () {
    'use strict';

    angular
        .module('mkdirActionService', [])
        .factory('mkdirActionService', mkdirActionService);

    mkdirActionService.$inject = ['mainService', 'commandService', '$log'];

    function mkdirActionService(mainService, commandService, $log) {
        $log.info('mkdirActionService...');

        //var getTargetDir = mainService.getTargetDir;
        var getSourceDir = mainService.getSourceDir;
        var getSourcePanelIndex = mainService.getSourcePanelIndex;

        var getInitName = function getInitName() {
            var rows = mainService.getSelectedRows();
            if (rows.length > 0) {
                var s = rows[0].base;
                if (s.indexOf('.')>-1) return s.substring(0, s.lastIndexOf('.'));
                return s;
            }
            return '';
        };

        var mkdir = function mkdir(dir, name) {
            var panelIndex = getSourcePanelIndex();
            // TODO das reicht hier nicht. wir wollen das neue Verzeichnis selectieren! mainService.storeLastRowIndex();
            commandService.addActions([
                commandService.mkdir({
                    dir: dir,
                    base: name,
                    panelIndex: panelIndex
                }),
                commandService.refreshPanel(panelIndex)
            ]);
        };

        var ret = {};
        ret.getInitName = getInitName;
        ret.getSourceDir = getSourceDir;
        ret.mkdir = mkdir;
        return ret;
    }

}());