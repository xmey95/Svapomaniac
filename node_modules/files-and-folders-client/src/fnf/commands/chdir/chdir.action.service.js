(function () {
    'use strict';

    angular
        .module('chdirActionService', [])
        .factory('chdirActionService', chdirActionService);

    chdirActionService.$inject = ['chdirGridOptionsFactory', 'mainService', 'socketService', '$log'];

    function chdirActionService(chdirGridOptionsFactory, mainService, socketService, $log) {
        $log.info('chdirActionService...');

        var getGridOptions = chdirGridOptionsFactory.getOptions;
        var getTargetDir = mainService.getTargetDir;
        var getSourceDir = mainService.getSourceDir;

        var rid = 0;
        var on = socketService.on;
        var removeListener = socketService.removeListener;
        var emit = socketService.emit;

        var cancelWalk = function cancelWalk(rid) {
            $log.info('cancelWalk()', rid);
            emit('walkfolder', {cancelled: true, rid: rid});
        };

        var startWalking = function startWalking(callback) {
            rid++;
            $log.info('startWalking()', rid);
            var listenOn = 'walkfolder' + rid;
            on(listenOn, function (name) {
                if (callback) callback(name);
            });
            emit('walkfolder', {
                dir: getSourceDir(),
                rid: rid
            });
            return rid;
        };


        var setFolder = function setFolder(name){
            mainService.setFolder(mainService.getSourcePanelIndex(), name);
            //$('button[data-dismiss="modal"]').click(); // dirty
        };


        var ret = {};
        ret.getGridOptions = getGridOptions;
        ret.startWalking = startWalking;
        ret.cancelWalk = cancelWalk;
        ret.removeListener = removeListener;
        ret.setFolder = setFolder;
        return ret;
    }

}());