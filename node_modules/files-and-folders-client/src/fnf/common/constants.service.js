(function () {
    'use strict';

    angular
        .module('fnfConstants', [])
        .factory('constantsService', ConstantsService);

    ConstantsService.$inject = [];

    function ConstantsService() {
        var ret = {};

        var applyConstants = function applyConstants(scope) {

            scope.TRIGGER_DIGEST = 'TRIGGER_DIGEST';
            scope.OPEN_COPY_DLG = 'OPEN_COPY_DLG';
            scope.OPEN_MOVE_DLG = 'OPEN_MOVE_DLG';
            scope.OPEN_MKDIR_DLG = 'OPEN_MKDIR_DLG';
            //scope.MOVE = 'MOVE';
            //scope.CREATE_DIR = 'CREATE_DIR';
            scope.OPEN_DELETE_DLG = 'OPEN_DELETE_DLG';

            scope.ADD_NEW_TAB = 'ADD_NEW_TAB';
            scope.REMOVE_TAB = 'REMOVE_TAB';
            scope.SELECT_RIGHT_PANEL = 'SELECT_RIGHT_PANEL';
            scope.SELECT_LEFT_PANEL = 'SELECT_LEFT_PANEL';
            scope.TOGGLE_PANEL = 'TOGGLE_PANEL';

            scope.OPEN_CHDIR_DLG = 'OPEN_CHDIR_DLG';
            scope.OPEN_GOTO_ANYTHING_DLG = 'OPEN_GOTO_ANYTHING_DLG';
            scope.OPEN_JOB_QUEUE_DLG = 'OPEN_JOB_QUEUE_DLG';
            scope.OPEN_MULTIRENAME_DLG = 'OPEN_MULTIRENAME_DLG';
            scope.OPEN_RENAME_DLG = 'OPEN_RENAME_DLG';

            scope.COPY_2_CLIPBOARD_FULLNAMES = 'COPY_2_CLIPBOARD_FULLNAMES';
            scope.COPY_2_CLIPBOARD_NAMES = 'COPY_2_CLIPBOARD_NAMES';
            scope.COPY_2_CLIPBOARD_FULLNAMES_AS_JSON = 'COPY_2_CLIPBOARD_FULLNAMES_AS_JSON';
            scope.COPY_2_CLIPBOARD_NAMES_AS_JSON = 'COPY_2_CLIPBOARD_NAMES_AS_JSON';
            scope.OPEN_FIND_DLG = 'OPEN_FIND_DLG';
            scope.OPEN_DROP_DLG = 'OPEN_DROP_DLG';
            scope.OPEN_GROUPFILES_DLG = 'OPEN_GROUPFILES_DLG';
            scope.OPEN_FIND_DUBLICATES_DLG = 'OPEN_FIND_DUBLICATES_DLG';
            scope.OPEN_SELECT_DLG = 'OPEN_SELECT_DLG';
            scope.OPEN_DESELECT_DLG = 'OPEN_DESELECT_DLG';
            scope.OPEN_DELETE_EMPTY_FOLDERS_DLG = 'OPEN_DELETE_EMPTY_FOLDERS_DLG';
            scope.OPEN_COLORCONFIG_DLG = 'OPEN_COLORCONFIG_DLG';

            scope.TOGGLE_SELECTION = 'TOGGLE_SELECTION';
            scope.SELECT_ALL = 'SELECT_ALL';
            scope.DESELECT_ALL = 'DESELECT_ALL';
            scope.ENHANCE_SELECTION = 'ENHANCE_SELECTION';
            //scope.DESELECT = 'DESELECT';
            scope.REDUCE_SELECTION = 'REDUCE_SELECTION';

            scope.NAVIGATE_LEVEL_DOWN = 'NAVIGATE_LEVEL_DOWN';
            scope.NAVIGATE_BACK = 'NAVIGATE_BACK';
            scope.SAVE_CONFIG = 'SAVE_CONFIG';
            scope.RELOAD_DIR = 'RELOAD_DIR';

            scope.ENTER_PRESSED = 'ENTER_PRESSED';
            scope.HOME_PRESSED = 'HOME_PRESSED';
            scope.SPACE_PRESSED = 'SPACE_PRESSED';
            scope.END_PRESSED = 'END_PRESSED';
            scope.PAGEUP_PRESSED = 'PAGEUP_PRESSED';
            scope.PAGEDOWN_PRESSED = 'PAGEDOWN_PRESSED';
            scope.TOGGLE_SELECTION_CURRENT_ROW = 'TOGGLE_SELECTION_CURRENT_ROW';
            scope.DUMMY_ACTION = 'DUMMY_ACTION';

            return ret;
        };


        applyConstants(ret);

        ret.applyConstants = applyConstants;

        return ret;
    }

}());