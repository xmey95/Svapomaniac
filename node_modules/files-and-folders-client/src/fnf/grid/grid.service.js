(function () {
    'use strict';

    angular
        .module('app')
        .service('gridService', GridService);

    GridService.$inject = ['$log', 'gridModelFactory', 'gridOptionsFactory'];

    function GridService($log, gridModelFactory, gridOptionsFactory) {
        $log.info('gridService...');

        var ret = {};

        var createGridModel = function createGridModel() {
            var options = gridOptionsFactory.getOptions();
            return gridModelFactory.getInstance(options);
        };

        var data = {
            gridModels: [
                createGridModel(),
                createGridModel()
            ]
        };

        var storeSelection = function storeSelection(api) {
            var ret = [];
            var selectedNodes = api.getSelectedNodes();
            for (var i = 0; i < selectedNodes.length; i++) {
                var f = selectedNodes[i].data;
                ret.push({
                    dir: f.dir,
                    base: f.base
                });
            }

            return ret;
        };

        var restoreSelection = function restoreSelection(storedSelection, api) {
            api.forEachNode(function (node) {
                var found = isStored(node.data, storedSelection);
                if (found) {
                    api.selectNode(node, true /* == multi */);
                }
            });
        };

        var isStored = function isStored(file, storedSelection) {
            for (var i = 0; i < storedSelection.length; i++) {
                var f = storedSelection[i];
                if (f.base === file.base && f.dir === file.dir) {
                    return true;
                }
            }

            return false;
        };

        var getGridModels = function getGridModels() {
            var m = [
                createGridModel(),
                createGridModel()
            ];
            return m;
        };

        var getGridApi = function getGridApi(index) {
            return getGridOptions(index).api;
        };

        var getGridOptions = function getGridOptions(index) {
            return getGridModel(index).getGridOptions();
        };
        var getGridModel = function getGridModel(index) {
            return data.gridModels[index];
        };
        var getGridModelCount = function getGridModelCount() {
            return data.gridModels.length;
        };

        var autoFocusedCell = function autoFocusedCell(panelIndex) {
            var api = getGridApi(panelIndex);
            var gridOptions = getGridOptions(panelIndex);
            var r = gridOptions.lastRowIndex;

            if (r === undefined) {
                var focussedCell = api.getFocusedCell();
                if (focussedCell) {
                    r = focussedCell.rowIndex;
                } else {
                    var selectedNodes = api.getSelectedNodes();

                    if (selectedNodes && selectedNodes.length > 0) {
                        r = selectedNodes[0].childIndex;
                    }
                }
            }
            if (r === undefined) r = 0;
            r = Math.max(0, Math.min(gridOptions.rowData.length-1 ,r));
            api.setFocusedCell(r, 0);
        };

        ret.storeSelection = storeSelection;
        ret.restoreSelection = restoreSelection;
        ret.getGridModels = getGridModels;
        ret.getGridApi = getGridApi;
        ret.getGridOptions = getGridOptions;
        ret.getGridModel = getGridModel;
        ret.getGridModelCount = getGridModelCount;
        ret.autoFocusedCell = autoFocusedCell;
        return ret;
    }

})();