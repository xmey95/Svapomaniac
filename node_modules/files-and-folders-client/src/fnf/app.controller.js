(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['mainService', 'folderService', 'initService', 'gridService', 'dataService', 'actionQueueService',
        'shortcutService', 'constantsService', 'selectionService', 'folderActionService',
        'tabService', 'actionService', 'notifyService', 'historyService', 'configService', 'colorService', '$log', '$timeout'];

    function AppController(mainService, folderService, initService, gridService, dataService, actionQueueService,
                           shortcutService, constantsService, selectionService, folderActionService,
                           tabService, actionService, notifyService, historyService, configService, colorService, $log, $timeout) {

        $log.info('AppController...');

        var vm = this;
        vm.colorPopoverVisible = false;
        // $timeout(function () {
        //     vm.colorPopoverVisible = true;
        // }, 3333);

        vm.getShortcutByActionId = shortcutService.getShortcutByActionId;
        vm.printShortcutByActionId = shortcutService.printShortcutByActionId;
        vm.getLabelForAction = shortcutService.getLabelForAction;

        var kbdHtml = shortcutService.kbdHtml;
        vm.printShortcutByActionIdAsHtml = function printShortcutByActionIdAsHtml(id){
            return kbdHtml(vm.printShortcutByActionId(id));
        };

        vm.data = dataService.getData();

        vm.getGridOptions = gridService.getGridOptions;
        vm.getGridModel = gridService.getGridModel;
        vm.getGridModelCount = gridService.getGridModelCount;
        vm.action = actionService.action;
        vm.init = initService.init;
        //vm.addTab = tabService.addTab;

        vm.getFolderLabel = folderService.getFolderLabel;
        //var loadDirectory = folderService.loadDirectory;

        vm.getQueueStatus = actionQueueService.getQueueStatus;
        vm.getQueueProgress = actionQueueService.getQueueProgress;

        vm.getDir = mainService.getDir;
        vm.getActivePath = mainService.getSourceDir;
        vm.onTabDblclicked = mainService.onTabDblclicked;
        vm.onTabClicked = mainService.onTabClicked;
        vm.addTab = mainService.addTab;

        vm.reload = mainService.reload;
        vm.setFolder = mainService.setFolder;

        vm.isFav = configService.isFav;
        vm.unfav = configService.unfav;
        vm.fav = configService.fav;

        vm.popupMenu = function popupMenu(e, panelIndex) {
            notifyService.emit('SHOW_POPUP', {event: e, panelIndex: panelIndex});
            // dirty1 --> TODO  directive!
            //console.info(e);
            //var srcEle = e.target ? e.target : e.srcElement;
            //var poupEle = $('#gridPopup');
            //poupEle.addClass('open'); //.css(cssPos);
            //new Tether({
            //    element: poupEle,
            //    target: srcEle,
            //    attachment: 'middle center',
            //    targetAttachment: 'middle center'
            //});
        };

        vm.getLatest = historyService.getLatest;

        vm.setActivePanel = function setActivePanel(index) {
            vm.data.activePanelIndex = index;
        };
        vm.setStyle = function setStyle(style) {
            // console.info(style);
            colorService.loadColorConfig(style, function(response){
                if (response.status === 200) {
                    vm.data.colorname = style;
                    // $log.info(response.data);
                    for (var col in response.data.colors) {
                        document.documentElement.style.setProperty(col, response.data.colors[col]);
                    }
                }
            });
        };

        vm.openDropDialog = function openDropDialog(e) {
            //$log.info('main openDropDialog() e:', e);
            vm.action(vm.OPEN_DROP_DLG); // TODO
        };

        vm.setFolderOnActivePanel = function setFolderOnActivePanel(folder) {
            vm.setFolder(vm.data.activePanelIndex, folder);
        };
        vm.runTool = mainService.runTool;

        constantsService.applyConstants(vm);

        // triggered by server:
        notifyService
            .addListener(actionQueueService.ACTION_REFRESH_PANEL, function (obj, key) {
                $log.info(actionQueueService.ACTION_REFRESH_PANEL, obj, key);
                vm.reload(obj.index);
            })
            .addListener('FILES_DROPPED', function (files, key) {
                // files is a FileList of File objects. List some properties.
                //var output = [];
                //for (var i = 0, f; f = files[i]; i++) {
                //    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                //        f.size, ' bytes, last modified: ',
                //        f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                //        '</li>');
                //}
                // TODO ask, yes / no, then upload files
                $log.info('files', files);
            });

        $log.log(selectionService.iam);
        $log.log(folderActionService.iam);
    }
})();