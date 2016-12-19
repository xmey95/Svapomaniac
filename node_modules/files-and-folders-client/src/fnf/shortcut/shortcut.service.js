(function () {
    'use strict';

    angular
        .module('shortcutService', [])
        .factory('shortcutService', ShortcutService);

    ShortcutService.$inject = [
        'appKeyboardService',
        'actionLabelMappingService',
        '$log'];

    function ShortcutService(appKeyboardService, actionLabelMappingService, $log) {

        var mapping = [];
        var getLabelForAction = actionLabelMappingService.getLabelForAction;

        var getShortcutIds = function getShortcutIds() {
            var ret = [];
            for (var i = 0; i < mapping.length; i++) {
                ret.push(mapping[i].id);
            }
            return ret;
        };

        var getShortcut = function getShortcut(id) {
            for (var i = 0; i < mapping.length; i++) {
                var item = mapping[i];
                if (item.id === id) return item.shortcut;
            }
            return null;
        };

        var kbdHtml = function kbdHtml(s) {
            if (!s) return '';
            return '<kbd>' + s.split(' ').join('</kbd> <kbd>') + '</kbd>';
        };

        var printShortcutByActionId = function printShortcutByActionId(id) {
            var s = getShortcut(id);
            return printShortcut(s);
        };

        var printShortcut = function printShortcut(s) {
            if (!s) return undefined;

            // https://support.apple.com/kb/PH18802?locale=de_DE
            // https://mothereff.in/html-entities
            return s
                .toUpperCase()
                .replace(/_/g, ' ')
                .replace(/SUBTRACT/g, '-')
                .replace(/MULTIPLY/g, '*')
                .replace(/CMD/g, '&#x2318;') // '⌘'
                .replace(/ENTER/g, '&#x23CE;') // '⏎'
                .replace(/RETURN/g, '&#x23CE;')
                .replace(/CTRL/g, '⌃')
                .replace(/CONTROL/g, '&#x2303;') // '⌃'
                .replace(/OPTION/g, '&#x2325;') // '⌥'
                .replace(/SHIFT/g, '&#8679;') // '⇧'
                .replace(/ADD/g, '+')
                .replace(/NUM/g, 'num')
                .replace(/ALT/g, 'alt')
                ;

        };


        var getShortcutByActionId = function getShortcutByActionId(id) {
            var s = getShortcut(id);
            if (!s) return undefined;
            return s
                .toUpperCase()
                .replace(/ /g, '-')
                .replace(/\+/g, '-')
                .replace(/CTRL/g, 'Ctrl')
                .replace(/CMD/g, 'cmd')
                .replace(/ALT/g, 'Alt')
                .replace(/SHIFT/g, 'Shift');
        };

        var doBinding = function doBinding() {
            $log.info('ShortcutService> init.');
            appKeyboardService.addMainMenuShortcuts(mapping);
        };
        
        var getMapping = function getMapping() {
            return mapping;
        };
        
        var setMapping = function setMapping(m) {
            mapping = m;
            doBinding();
        };
        
        return {
            kbdHtml: kbdHtml,
            setMapping: setMapping,
            getMapping: getMapping,
            getShortcutIds: getShortcutIds,
            getShortcutByActionId: getShortcutByActionId,
            getLabelForAction: getLabelForAction,
            printShortcutByActionId: printShortcutByActionId,
            printShortcut: printShortcut
        };
    }
}());