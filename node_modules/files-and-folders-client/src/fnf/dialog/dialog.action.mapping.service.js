(function () {
    'use strict';

    angular
        .module('dialogActionMappingService', [])
        .factory('dialogActionMappingService', dialogActionMappingService);

    dialogActionMappingService.$inject = ['constantsService', '$log'];

    function dialogActionMappingService(constantsService, $log) {
        $log.info('dialogActionMappingService...');

        var ret = {};
        constantsService.applyConstants(ret);

        var actionDialogMap = {};
        actionDialogMap[ret.OPEN_DROP_DLG] = {id: 'fnf-drop-dialog', url: '/fnf/drop/dialog.html'};

        actionDialogMap[ret.OPEN_CHDIR_DLG] = {id: 'fnf-chdir-dialog', url: '/fnf/commands/chdir/dialog.html'};
        actionDialogMap[ret.OPEN_JOB_QUEUE_DLG] = {id: 'fnf-jobqueue-dialog', url: '/fnf/action/jobqueue/dialog.html'};
        actionDialogMap[ret.OPEN_GOTO_ANYTHING_DLG] = {id: 'fnf-gotoanything-dialog', url: '/fnf/action/gotoanything/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_MULTIRENAME_DLG] = {id: 'fnf-multirename-dialog', url: '/fnf/commands/multirename/dialog.html'};
        actionDialogMap[ret.OPEN_RENAME_DLG] = {id: 'fnf-rename-dialog', url: '/fnf/commands/rename/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_DELETE_EMPTY_FOLDERS_DLG] = {id: 'fnf-delete-empty-folders-dialog', url: '/fnf/commands/deleteemptyfolders/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_FIND_DLG] = {id: 'fnf-find-action-dialog', url: '/fnf/commands/find/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_DELETE_DLG] = {id: 'fnf-delete-action-dialog', url: '/fnf/commands/delete/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_COPY_DLG] = {id: 'fnf-copy-action-dialog', url: '/fnf/commands/copy/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_MOVE_DLG] = {id: 'fnf-move-action-dialog', url: '/fnf/commands/move/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_MKDIR_DLG] = {id: 'fnf-mkdir-action-dialog', url: '/fnf/commands/mkdir/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_FIND_DUBLICATES_DLG] = {id: 'fnf-finddublicates-dialog', url: '/fnf/commands/finddublicates/dialog.html'};
        actionDialogMap[ret.OPEN_GROUPFILES_DLG] = {id: 'fnf-groupfiles-dialog', url: '/fnf/commands/groupfiles/dialog.html', nocache: true};
        actionDialogMap[ret.OPEN_SELECT_DLG] = {id: 'fnf-selection-dialog', url: '/fnf/commands/select/selectdialog.html'};
        actionDialogMap[ret.OPEN_DESELECT_DLG] = {id: 'fnf-deselection-dialog', url: '/fnf/commands/select/deselectdialog.html'};
        actionDialogMap[ret.OPEN_COLORCONFIG_DLG] = {id: 'fnf-colorconfig-dialog', url: '/fnf/config/color/dialog.html', nocache: true};
        
        var getDialogMetaData = function getDialogMetaData(actionId) {
            return actionDialogMap[actionId];
        };

        ret.iam = 'dialogActionMappingService';
        ret.getDialogMetaData = getDialogMetaData;
        return ret;
    }

}());