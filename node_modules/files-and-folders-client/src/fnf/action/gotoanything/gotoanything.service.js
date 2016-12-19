(function () {
    'use strict';

    angular
        .module('gotoAnythingService', [])
        .factory('gotoAnythingService', GotoAnythingService);

    GotoAnythingService.$inject = [
            '$templateCache', 'shortcutService', 'actionLabelMappingService', 'dataService', 'mainService', 
            'notifyService', '$log'];

    function GotoAnythingService($templateCache, shortcutService, actionLabelMappingService, dataService, mainService, 
                                 notifyService, $log) {
        $log.info('gotoAnythingService...');


        $templateCache.put("uib/template/typeahead/typeahead-match.html",
            "<div tabindex=\"-1\"\ ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></div>");

        $templateCache.put("uib/template/typeahead/typeahead-popup.html",
            "<ul class=\"list-group dropdown-menu\" ng-show=\"isOpen() && !moveInProgress\" ng-style=\"{top: position().top+'px', left: position().left+'px'}\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
            "    <li class=\"list-group-item\" ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index, $event)\" role=\"option\" id=\"{{::match.id}}\">\n" +
            "        <div uib-typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
            "    </li>\n" +
            "</ul>\n" +
            "");

        var execute = function execute(o){
            if (o.tool) {
                mainService.runTool(o.tool);
            } else if (o.item) {
                notifyService.emit(o.item.id);
            }
            $log.info('Unknown object:', o);
        };

        var commands = [];
        var getCommands = function getCommands() {
            return commands;
        };

        var hasLabel = function hasLabel(label) {
            for (var j = 0; j < commands.length; j++) {
                if (commands[j].label === label) return true;
            }
            return false;
        };

        (function () {
            var i;
            var items = shortcutService.getMapping();
            for (i = 0; i < items.length; i++) {
                var item = items[i];
                //$log.info('item', item);

                var label = actionLabelMappingService.getLabelForAction(item.id);
                //if (!label) label = item.id;
                var shortcut = item.shortcut;
                if (!shortcut) shortcut = '';
                if (label) {
                    if (!hasLabel(label)) {
                        commands.push({label: label, item: item});
                    }
                }
            }
            var tools = dataService.getData().tools;
            for (i = 0; i < tools.length; i++) {
                if (!hasLabel(tools[i].label)) {
                    commands.push({label: tools[i].label, tool: tools[i]});
                }
            }
            //$log.info('gotoAnythingService.commands', commands);
        })();


        var ret = {};
        ret.iam = 'gotoAnythingService';
        ret.getCommands = getCommands;
        ret.execute = execute;
        return ret;
    }

}());