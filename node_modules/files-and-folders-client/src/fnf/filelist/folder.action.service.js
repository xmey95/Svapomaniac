(function () {
    'use strict';

    angular
        .module('folderActionService', [])
        .factory('folderActionService', folderActionService);

    folderActionService.$inject = ['gridService', 'tabService', 'eventCacheFactory', 'notifyService', '$log'];

    function folderActionService(gridService, tabService, eventCacheFactory, notifyService, $log) {
        $log.info('folderActionService...');

        var ret = {};

        var getGridOptions = gridService.getGridOptions;
        var storeSelection = gridService.storeSelection;
        var restoreSelection = gridService.restoreSelection;

        var createdEventCache = eventCacheFactory.createCache(function (events) {

            var getDublicate = function getDublicate(rows, dir, base) {
                for (var i = rows.length - 1; i > -1; i--) {
                    if (rows[i].dir === dir && rows[i].base === base) {
                        return rows[i];
                    }
                }
                return null;
            };

            tabService.eachActiveTab(function (tab, sideIndex, tabIndex) {
                // event.panelIndex  entspricht dem sideIndex, wird hier aber ignoriert
                var options = getGridOptions(sideIndex);
                var api = options.api;
                var storedSelection = storeSelection(api);
                var selectionMustRestored = false;
                var r, row, dub, event, selectedNodes, j, f;

                for (var i = 0; i < events.length; i++) {
                    event = events[i];
                    if (event.item.dir === tab.path) {
                        if (event.event === 'focus') { // TODO schein nach 'rename...' nicht zu gehen
                            selectionMustRestored = false;
                            api.deselectAll();
                            var model = api.getModel();
                            r = 0;
                            model.forEachNode(function (node) {
                                var f = node.data;
                                if (f.base === event.item.base && f.dir === event.item.dir) {
                                    api.setFocusedCell(node.childIndex, 0);
                                }
                                r++;
                            });

                        } else if (event.event === 'select') {
                            selectedNodes = api.getSelectedNodes();
                            for (j = 0; j < selectedNodes.length; j++) {
                                f = selectedNodes[j].data;
                                if (f.base === event.item.base && f.dir === event.item.dir) {
                                    api.selectNode(selectedNodes[j], true, false);
                                } else {
                                    api.deselectNode(selectedNodes[j], false);
                                }
                            } // for

                        } else if (event.event === 'unselect') {
                            selectedNodes = api.getSelectedNodes();
                            for (j = 0; j < selectedNodes.length; j++) {
                                f = selectedNodes[j].data;
                                if (f.base === event.item.base && f.dir === event.item.dir) {
                                    api.deselectNode(selectedNodes[j], false);
                                }
                            } // for

                        } else if (event.event === 'removed') {
                            //if (event.panelIndex === sideIndex) {
                            for (r = 0; r < options.rowData.length; r++) {
                                row = options.rowData[r];
                                if (row.dir === event.item.dir && row.base === event.item.base) {
                                    options.rowData.splice(r, 1);
                                    selectionMustRestored = true;
                                    api.refreshView(); // TODO ?
                                    api.setRowData(options.rowData);
                                }
                            }
                            //}

                        } else if (event.event === 'update') {
                            // TODO event.item.base, event.item.dir -> event.item.status
                            for (r = 0; r < options.rowData.length; r++) {
                                row = options.rowData[r];
                                if (row.dir === event.item.dir && row.base === event.item.base) {
                                    row.status = event.item.status;
                                    selectionMustRestored = true;
                                    api.refreshView(); // TODO ?
                                }
                            }

                        } else if (event.event === 'created') {
                            dub = getDublicate(options.rowData, event.item.dir, event.item.base);
                            row = dub ? dub : {};

                            row.dir = event.item.dir;
                            row.base = event.item.base;
                            row.ext = event.item.base.substr(event.item.base.lastIndexOf('.'));

                            if (event.item.size) row.size = event.item.size;
                            if (event.item.date) row.date = event.item.date;
                            if (event.item.isDir) row.isDir = true;
                            if (event.item.status) {
                                row.status = event.item.status;
                            } else {
                                row.status = null;
                            }

                            if (!dub) options.rowData.push(row);

                            api.setRowData(options.rowData);
                            //api.onNewRows(); // TODO ?
                            selectionMustRestored = true;
                        }
                    }
                } // for

                if (selectionMustRestored) restoreSelection(storedSelection, api);
            });
        });


        notifyService.addListener('unselect', createdEventCache.add);
        notifyService.addListener('select', createdEventCache.add);
        notifyService.addListener('created', createdEventCache.add);
        notifyService.addListener('update', createdEventCache.add);
        notifyService.addListener('focus', createdEventCache.add);
        notifyService.addListener('removed', createdEventCache.add);

        ret.iam = 'folderActionService';
        return ret;
    }

}());