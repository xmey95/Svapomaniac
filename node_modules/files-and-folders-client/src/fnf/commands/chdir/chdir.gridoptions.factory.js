(function () {
    'use strict';

    angular
        .module('chdirGridOptionsFactory', [])
        .factory('chdirGridOptionsFactory', chdirGridOptionsFactory);

    chdirGridOptionsFactory.$inject = ['gridiconService'];

    function chdirGridOptionsFactory(gridiconService) {

        var Options = function Options() {
            var columnDefs = [
                //{headerName: "Name", field: "name", width: 80, icons: gridiconService.TEXT_SORT_ICONS},
                {headerName: "Directory", field: "name", width: 1200, icons: gridiconService.TEXT_SORT_ICONS}
            ];

            var onCellFocused = function onCellFocused(event) {
                var rowIndex = event.rowIndex;
                // https://github.com/ceolter/ag-grid/issues/373
                $('.ag-row-focus', this.api.grid.gridPanel.eBodyContainer).removeClass('ag-row-focus');
                $('.ag-row[row="' + rowIndex + '"]', this.api.grid.gridPanel.eBodyContainer).addClass('ag-row-focus');
            };

            var options = {
                quickFilterText: '',
                headerHeight: 30,
                rowHeight: 23,
                columnDefs: columnDefs,
                rowSelection: 'single',
                rowDeselection: true,
                enableColResize: true,
                enableSorting: true,
                //sortingOrder: ['asc', 'desc'],
                icons: gridiconService.ICONS,
                onCellFocused: onCellFocused
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