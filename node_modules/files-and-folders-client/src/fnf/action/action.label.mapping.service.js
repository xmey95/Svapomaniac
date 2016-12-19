(function () {
    'use strict';

    angular
        .module('actionLabelMappingService', [])
        .factory('actionLabelMappingService', actionLabelMappingService);

    actionLabelMappingService.$inject = [
        'constantsService',
        '$log'];

    function actionLabelMappingService(constantsService, $log) {
        $log.info('actionLabelMappingService...');

        var mapping = {};
        mapping[constantsService.COPY_2_CLIPBOARD_FULLNAMES] = 'Copy full names to clipboard';
        mapping[constantsService.COPY_2_CLIPBOARD_NAMES] = 'Copy names to clipboard';
        mapping[constantsService.COPY_2_CLIPBOARD_FULLNAMES_AS_JSON] = 'Copy full names to clipboard as JSON';
        mapping[constantsService.COPY_2_CLIPBOARD_NAMES_AS_JSON] = 'Copy names to clipboard as JSON';
        mapping[constantsService.OPEN_COPY_DLG] = 'Copy';
        mapping[constantsService.OPEN_MOVE_DLG] = 'Move';
        mapping[constantsService.OPEN_MKDIR_DLG] = 'Create Dir';
        mapping[constantsService.OPEN_DELETE_DLG] = 'Delete';
        mapping[constantsService.SELECT_LEFT_PANEL] = 'Left Panel';
        mapping[constantsService.SELECT_RIGHT_PANEL] = 'Right Panel';
        mapping[constantsService.TOGGLE_PANEL] = 'Toggle Panel';
        mapping[constantsService.ADD_NEW_TAB] = 'Add Tab';
        mapping[constantsService.REMOVE_TAB] = 'Remove Tab';

        mapping[constantsService.OPEN_GOTO_ANYTHING_DLG] = 'Go to anything...';
        mapping[constantsService.SAVE_CONFIG] = 'Save Config';
        mapping[constantsService.OPEN_GROUPFILES_DLG] = 'Group Files...';
        mapping[constantsService.OPEN_CHDIR_DLG] = 'Change Dir...';
        mapping[constantsService.OPEN_FIND_DUBLICATES_DLG] = 'Find Dublicates...';
        mapping[constantsService.OPEN_MULTIRENAME_DLG] = 'Multi Rename...';
        mapping[constantsService.OPEN_RENAME_DLG] = 'Rename...';
        mapping[constantsService.OPEN_DELETE_EMPTY_FOLDERS_DLG] = 'Delete Empty Folders...';
        mapping[constantsService.OPEN_FIND_DLG] = 'Find...';
        mapping[constantsService.RELOAD_DIR] = 'Reload...';

        mapping[constantsService.OPEN_SELECT_DLG] = 'Enhance Selection...';
        mapping[constantsService.SELECT_ALL] = 'Select All';
        mapping[constantsService.SELECT_ALL] = 'Select All';

        mapping[constantsService.OPEN_DESELECT_DLG] = 'Reduce Selection...';
        mapping[constantsService.DESELECT_ALL] = 'Deselect All';

        mapping[constantsService.TOGGLE_SELECTION] = 'Toggle Selection';
        //mapping[constantsService.TOGGLE_SELECTION_CURRENT_ROW] = 'Toggle Selection Current Row';
        mapping[constantsService.NAVIGATE_LEVEL_DOWN] = 'Parent Dir';
        mapping[constantsService.NAVIGATE_BACK] = 'History Back';
        mapping[constantsService.NAVIGATE_LEVEL_DOWN] = 'Parent Dir';
        mapping[constantsService.NAVIGATE_BACK] = 'History Back';
        //mapping[constantsService.ENTER_PRESSED] = 'Run or navigate';
        mapping[constantsService.OPEN_COLORCONFIG_DLG] = 'Color Config...';



        var getLabelForAction = function getLabelForAction(id) {
            var ret = mapping[id];
            if (!ret) $log.warn('No label for ' + id);
            return ret;
        };

        return {
            getLabelForAction: getLabelForAction
        };
    }

}());