(function () {
    'use strict';

    angular
        .module('jobQueueGridOptionsFactory', [])
        .factory('jobQueueGridOptionsFactory', jobQueueGridOptionsFactory);

    jobQueueGridOptionsFactory.$inject = ['gridiconService'];

    function jobQueueGridOptionsFactory(gridiconService) {

        // todo farben für SUCCESS ERROR
        var Options = function Options() {

            var statusCellRenderer = function statusCellRenderer(params) {
                if (!params) return '';
                if (!params.data) return '';

                var label = params.value.replace(params.data.ext, '');
                if (label === 'ERROR') return '<i class="text-danger"><i class="fa fa-exclamation-triangle"></i> ' + label + '</i>';
                if (label === 'SUCCESS') return '<i class="text-success"><i class="fa fa-check-circle-o"></i> ' + label + '</i>';
                if (label === 'PROCESSING') return '<i class="text-primary"><i class="fa fa-cogs"></i> ' + label + '</i>';

                return '<i class="fa fa-check-circle-o"></i> ' + label;
            };

            var columnDefs = [
                {headerName: "", field: "id", width: 60, sort: 'desc', icons: gridiconService.ALPHA_ICONS},
                {headerName: "Job", field: "jobId", width: 60, icons: gridiconService.ALPHA_ICONS},
                {headerName: "Status", field: "status", width: 100, icons: gridiconService.TEXT_SORT_ICONS, cellRenderer: statusCellRenderer},
                {headerName: "Action", field: "action", width: 110, icons: gridiconService.TEXT_SORT_ICONS},
                {headerName: "Source", field: "src", width: 500, icons: gridiconService.TEXT_SORT_ICONS, cellRenderer: gridiconService.fileCellRenderer},
                {headerName: "Target", field: "target", width: 600, icons: gridiconService.TEXT_SORT_ICONS, cellRenderer: gridiconService.fileCellRenderer}
            ];

            var onCellFocused = function onCellFocused(event) {
                var rowIndex = event.rowIndex;
                // https://github.com/ceolter/ag-grid/issues/373
                $('.ag-row-focus', this.api.grid.gridPanel.eBodyContainer).removeClass('ag-row-focus');
                $('.ag-row[row="' + rowIndex + '"]', this.api.grid.gridPanel.eBodyContainer).addClass('ag-row-focus');
            };

            var options = {
                headerHeight: 30,
                rowHeight: 23,
                columnDefs: columnDefs,
                rowSelection: 'multiple',
                rowDeselection: true,
                enableColResize: true,
                enableSorting: true,
                sortingOrder: ['asc', 'desc'],
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