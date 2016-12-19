(function () {
    'use strict';

    angular
        .module('ChdirActionController', [])
        .controller('ChdirActionController', ChdirActionController);

    ChdirActionController.$inject = ['chdirActionService', 'notifyService', '$timeout', '$log'];

    function ChdirActionController(chdirActionService, notifyService, $timeout, $log) {
        $log.info('ChdirActionController...');

        var setFolder = chdirActionService.setFolder;

        var vm = this;
        vm.gridOptions = chdirActionService.getGridOptions();
        vm.running = false;

        vm.chdirClicked = function chdirClicked(){
            var row = getFirstPossibleRow();
            if (!row) return; // skip.

            setFolder(row.name);
        };

        var getFirstSelectedItem = function getFirstSelectedItem() {
            var rows = vm.gridOptions.api.getSelectedRows();
            if (rows.length > 0) return rows[0];
            return null;
        };

        var getFocusedRow = function getFocusedRow() {
            var cell = vm.gridOptions.api.getFocusedCell();
            if (!cell) return null;
            return cell.node.data;
        };

        var getFirstPossibleRow = function getFirstPossibleRow() {
            var row = getFirstSelectedItem();
            if (row) return row;

            row = getFocusedRow();
            if (row) return row;

            var rowData = vm.gridOptions.api.grid.gridOptions.rowData;
            if (rowData && rowData.length > 0) return rowData[0];

            return null;
        };

        var rid;
        var init = function init() {
            vm.running = true;
            vm.gridOptions.api.setRowData([]);
            vm.gridOptions.api.addEventListener('rowDoubleClicked', function (event) {
                setFolder(event.data.name);
                $('button[data-dismiss="modal"]').click(); // dirty
            });

            var rows = [];
            var lastUpdate = Date.now();
            rid = chdirActionService.startWalking(function (name) {
                if (name) {
                    if (name.end) {
                        $timeout(function () {
                            $log.info('walk ended.', rid);
                            vm.running = false;
                            vm.gridOptions.api.setRowData(rows);
                        });
                    } else {
                        rows.push({name: name});
                        // if (rows.length % 100 === 0)
                        if (Date.now() - lastUpdate > 2000) {
                            lastUpdate = Date.now();
                            vm.gridOptions.api.setRowData(rows);
                        }
                    }
                }
            });
        };

        vm.cancelWalk = function cancelWalk() {
            chdirActionService.cancelWalk(rid);
            vm.running = false;
        };



        notifyService
            .removeListenersForKey('OPEN_CHDIR_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_CHDIR_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_CHDIR_DLG_ON_HIDDEN')
            .addListener('OPEN_CHDIR_DLG_ON_SHOW', init)
            .addListener('OPEN_CHDIR_DLG_ON_HIDDEN', vm.cancelWalk);
    }
})();