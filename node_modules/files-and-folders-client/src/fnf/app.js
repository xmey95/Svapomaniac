(function () {
    'use strict';

    var _t1 = new Date().getTime();
    angular
        .module('app', [
            'ngSanitize',
            'agGrid',
            'ui.bootstrap.typeahead',
            //'ui.bootstrap.popover',
            //'uib/template/popover/popover.html',

            'colorService',
            'fnfConstants',
            'actionLabelMappingService',
            'shortcutService',
            'notify',
            'keyboard',
            'app.keyboard',
            'folderBtnDirective',
            'menuitemDirective',
            'toolmenuitemDirective',
            'filecountDirective',
            'pathLabelDirective',
            'filterInputDirective',

            'rightClickDirective',
            'longClickDirective',
            'longPressDirective',
            'colorPopoverDirective',

            'templates',
            'socket',
            'filesocket',

            'searchService',

            'ChdirActionController',
            'chdirActionService',
            'chdirGridOptionsFactory',

            'gridModel',
            'gridOptions',
            'executorFactory',
            'actionQueueService',
            'dialogActionMappingService',
            'dialogService',
            'tabService',
            'eventCacheFactory',
            'SelectionController',
            'DeselectionController',

            'shellActionService',
            'openfileActionService',
            'commandService',

            'FindActionController',
            'findActionService',
            'DeleteEmptyFoldersActionController',
            'deleteEmptyFoldersActionService',
            'DeleteActionController',
            'deleteActionService',
            'CopyActionController',
            'copyActionService',
            'GroupfilesActionController',
            'groupfilesActionService',
            'groupfilesTableService',
            'MoveActionController',
            'moveActionService',
            'MkdirActionController',
            'mkdirActionService',
            'RenameActionController',
            'renameActionService',

            'MultirenameActionController',
            'multirenameActionService',
            'multirenameDataService',

            'GotoAnythingController',
            'gotoAnythingService',

            'JobQueueController',
            'jobQueueGridOptionsFactory',
            'jobService',
            'configService',
            'toolService',
            'folderActionService',
            'folderService',
            'actionService',
            'initService',
            'selectionService',
            'historyService',

            'deepSelectionService',
            'deepSumSizeService',

            'dropDirective',
            'dragEnterDirective',
            'dragOverDirective',
            'dragLeaveDirective',
            'DropActionController',
            'dropActionService',
            'dropzoneDirective',

            'clipboardService',

            'gridiconService',
            'mainService',

            'colorconfigService',
            'ColorconfigController'
        ])
        .config([
            '$provide',
            '$compileProvider',
            '$logProvider',
            function ($provide, $compileProvider, $logProvider) {
                $logProvider.debugEnabled(false);
                $compileProvider.debugInfoEnabled(false);
            }
        ])
        .run([
            '$log', 'searchService', '$timeout', '$templateCache',
            function ($log, searchService, $timeout, $templateCache) {
                var _t2 = new Date().getTime();
                $log.info('FnF app started in ' + (_t2 - _t1) + ' ms.');
                $log.info('searchService', searchService.init());
                $timeout(function(){
                    $('[tabindex]').removeAttr("tabindex");

                    // avoid leaving page after drop event:
                    document.addEventListener('dragover', function (event) {
                        event.preventDefault();
                        return false;
                    }, false);

                    document.addEventListener('drop', function (event) {
                        event.preventDefault();
                        return false;
                    }, false);

                }, 234);

            }
        ]);
})();

$(function(){
    // Tooltips and Popovers are opt-in for performance reasons, so we must initialize them ourself:
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});
