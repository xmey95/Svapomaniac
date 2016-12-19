(function () {
    'use strict';

    angular
        .module('gridOptions', [])
        .factory('gridOptionsFactory', GridOptionsFactory);

    GridOptionsFactory.$inject = ['gridiconService'];

    function GridOptionsFactory(gridiconService) {

        var gid = 0;
        var Options = function Options() {

            var columnDefs = [
                {
                    headerName: "Name",
                    field: "base",
                    width: 430,
                    //volatile: true,
                    cellRenderer: gridiconService.nameCellRenderer,
                    comparator: gridiconService.nameComparator,
                    sort: 'asc',
                    icons: gridiconService.TEXT_SORT_ICONS,
                    cellClassRules: gridiconService.cellClassRules
                },
                {
                    headerName: "Ext",
                    field: "ext",
                    width: 80,
                    //volatile: true,
                    cellRenderer: gridiconService.extCellRenderer,
                    icons: gridiconService.TEXT_SORT_ICONS,
                    cellClassRules: gridiconService.cellClassRules
                },
                {
                    headerName: "Size",
                    field: "size",
                    width: 110,
                    volatile: true,
                    icons: gridiconService.ALPHA_ICONS,
                    cellRenderer: gridiconService.sizeCellRenderer,
                    comparator: gridiconService.sizeComparator,
                    cellStyle: {"text-align": "right"},
                    cellClassRules: gridiconService.cellClassRules
                },
                {
                    headerName: "Date",
                    field: "date",
                    width: 180,
                    cellRenderer: gridiconService.dateCellRenderer,
                    cellClassRules: gridiconService.cellClassRules
                }
            ];

            var rowData1 = [];

            // see https://github.com/ceolter/ag-grid/issues/369
            var onRowClicked = function onRowClicked(params) {
                //console.info('params', params);
                var self = this;

                // We have to wait otherwise it overrides our selection
                setTimeout(function waitForAngularGridToFinish() {
                    // Select multiple rows when the shift key was pressed
                    if (params.event.shiftKey && self.previousSelectedRowIndex !== undefined) {
                        var smallerNumber = params.rowIndex < self.previousSelectedRowIndex ? params.rowIndex : self.previousSelectedRowIndex;
                        var biggerNumber = params.rowIndex > self.previousSelectedRowIndex ? params.rowIndex : self.previousSelectedRowIndex;

                        for (var rowIndexToSelect = smallerNumber; rowIndexToSelect <= biggerNumber; rowIndexToSelect++) {
                            self.api.selectIndex(rowIndexToSelect, true, false);
                        }
                    }

                    self.previousSelectedRowIndex = params.rowIndex;
                }, 0);
            };

            var onCellFocused = function onCellFocused(event) {
                var rowIndex = event.rowIndex;
                // https://github.com/ceolter/ag-grid/issues/373
                $('.ag-row-focus', this.api.grid.gridPanel.eBodyContainer).removeClass('ag-row-focus');
                $('.ag-row[row="' + rowIndex + '"]', this.api.grid.gridPanel.eBodyContainer).addClass('ag-row-focus');
            };

            var options = {
                gid: gid++,

                headerHeight: 30,
                rowHeight: 28,
                columnDefs: columnDefs,
                rowData: rowData1,
                rowSelection: 'multiple',
                rowDeselection: true,
                enableColResize: true,
                enableFilter: true,
                enableSorting: true,
                sortingOrder: ['asc', 'desc'],
                icons: gridiconService.ICONS,
                onCellFocused: onCellFocused,
                onRowClicked: onRowClicked
                //onRowSelected: rowSelectedFunc,
                //onRowDeselected: rowDeselectedFunc,
                //rowDoubleClicked: rowDoubleClicked
            };
            return options;
        };

        return {
            getOptions: function () {
                return new Options();
            }
        };
    }


}());