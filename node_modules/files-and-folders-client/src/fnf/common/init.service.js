(function () {
    'use strict';

    angular
        .module('initService', [])
        .factory('initService', initService);

    initService.$inject = [
        'fileSocketService', 'gridService', 'tabService', 'dataService', 'appKeyboardService',
        'mainService', 'actionService', 'notifyService', 'shortcutService', 'toolService',
        '$timeout', '$log'];

    function initService(fileSocketService, gridService, tabService, dataService, appKeyboardService,
                         mainService, actionService, notifyService, shortcutService, toolService,
                         $timeout, $log) {
        var ret = {};

        var openFile = mainService.openFile;
        var loadDirectory = mainService.loadDirectory;
        var getGridModelCount = gridService.getGridModelCount;
        var getGridApi = gridService.getGridApi;
        var getActiveTab = tabService.getActiveTab;
        var setFolder = mainService.setFolder;
        var getShortcutIds = shortcutService.getShortcutIds;
        var addListener = notifyService.addListener;
        var setInitialLoad = dataService.setInitialLoad;
        var initialLoad = fileSocketService.initialLoad;
        var getDefaultTools = toolService.getDefaultTools;

        var _data = dataService.getData();

        var focusFirstPanel = function focusFirstPanel(panelIndex, opt) {
            gridService.autoFocusedCell(_data.activePanelIndex);
        };

        var init = function init() {
            initialLoad(function (data) {
                if (data.error) return $log.error(data.error);
                var i;

                // TODO
                var tools = [];
                console.info('data.data',data.data);
                console.info(data.data.tools);
                var toolsconfig = data.data.tools;
                if (toolsconfig && toolsconfig.replaceDefaults) {
                    tools = toolsconfig.tools;
                } else {
                    tools = getDefaultTools({
                        osx: data.data.osx,
                        linux: data.data.linux,
                        windows: data.data.windows
                    });
                    if (toolsconfig) {
                        for (var j = 0; j < toolsconfig.tools.length; j++) {
                            var t = toolsconfig.tools[j];
                            tools.push(t);
                        }
                    }
                }
                angular.extend(_data.tools, tools);

                // Shortcuts:
                if (data.data.shortcutsconfig) {
                    _data.shortcutsconfig = data.data.shortcutsconfig;
                    shortcutService.setMapping(data.data.shortcutsconfig.mapping);
                }

                _data.availableStyles = data.data.availableStyles;
                if (data.data.color) {
                    _data.color = data.data.color;
                    // TODO color service
                    // TODO hier gehts weiter
                    if (_data.color.colors) {
                        for (var col in _data.color.colors) {
                            document.documentElement.style.setProperty(col, _data.color.colors[col]);
                            // console.info(col, 'var(' + _data.color.colors[col] + ')');
                        }
                    }
                }

                if (data.data.config) {
                    var config = data.data.config;
                    angular.extend(_data, config);
                } else {
                    _data.activePanelIndex = 0;
                }

                //$log.info('tools', tools); // todo weg
                setInitialLoad(data.data);
                var startingPoints = data.data.startingPoints;

                // init shortcuts (action listener):
                var shortcutIds = getShortcutIds();
                for (i = 0; i < shortcutIds.length; i++) {
                    addListener(shortcutIds[i], actionService.action);
                }


                // shortcuts der Tools anmelden:
                $log.info(' _data.tools',  _data.tools);
                appKeyboardService.addToolShortcuts(_data.tools);


                // load left and right folder tables:
                $timeout(function () {
                    // let's render shortcuts etc:
                    _data.configLoaded = true;

                    for (var idx = 0; idx < getGridModelCount(); idx++) {
                        (function (panelIndex) {

                            if (data.data.config) {
                                var p = getActiveTab(panelIndex).path;
                                loadDirectory(panelIndex, {path: p}, focusFirstPanel);
                            } else {
                                var si = (panelIndex + startingPoints.length - 1) % startingPoints.length;
                                loadDirectory(panelIndex, {path: startingPoints[si]}, focusFirstPanel);
                            }

                            getGridApi(panelIndex).addEventListener('rowDoubleClicked', function (event) {
                                var folder = event.data.dir + '/' + event.data.base;
                                if (event.data.isDir) {
                                    setFolder(panelIndex, folder);
                                } else {
                                    openFile(folder);
                                }
                            });
                        })(idx);
                    }
                });
            });
        };

        ret.init = init;
        ret.iam = 'initService';
        return ret;
    }

}());