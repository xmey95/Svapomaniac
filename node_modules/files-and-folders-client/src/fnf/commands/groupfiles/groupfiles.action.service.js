(function () {
    'use strict';

    angular
        .module('groupfilesActionService', [])
        .factory('groupfilesActionService', groupfilesActionService);

    groupfilesActionService.$inject = ['mainService', 'gridiconService', 'groupfilesTableService',
        'commandService', '$log'];

    function groupfilesActionService(mainService, gridiconService, groupfilesTableService,
                                     commandService, $log) {
        $log.info('groupfilesActionService...');

        var getTargetDir = mainService.getTargetDir;
        var getSourceDir = mainService.getSourceDir;
        var getSourcePanelIndex = mainService.getSourcePanelIndex;
        var getTargetPanelIndex = mainService.getTargetPanelIndex;
        var getSelectedFilesAndFolders = mainService.getSelectedFilesAndFolders;
        var tableRows = [];

        var columnDefs = [
            {headerName: "No", field: "id", width: 60, icons: gridiconService.ALPHA_ICONS},
            {headerName: "Source", field: "base", width: 300, icons: gridiconService.TEXT_SORT_ICONS},
            {headerName: "Group", field: "dir", width: 200, sort: 'asc', icons: gridiconService.TEXT_SORT_ICONS},
            {headerName: "Target", field: "target", width: 800, icons: gridiconService.TEXT_SORT_ICONS, cellRenderer: gridiconService.fileCellRenderer}
        ];

        var gridOptions = {
            rowData: tableRows,
            headerHeight: 30,
            rowHeight: 23,
            columnDefs: columnDefs,
            enableColResize: true,
            enableSorting: true,
            sortingOrder: ['asc', 'desc'],
            icons: gridiconService.ICONS
        };

        var dialogData = {
            gridOptions: gridOptions,
            modus: 'runnig_number',
            newFolder: '',
            useSsourceDir: false,
            groupCount: 0,
            minsize: '2',
            ignoreBrackets: true,
            okEnabled: true,
            minsizes: [
                {value: '0', label: 'none'},
                {value: '2', label: '2'},
                {value: '3', label: '3'},
                {value: '4', label: '4'},
                {value: '5', label: '5'},
                {value: '10', label: '10'}
            ],
            modes: [
                {value: 'runnig_number', label: 'Running number'},
                {value: 'new_folder', label: 'New folder (manually)'},
                {value: 'minus_separator', label: 'Minus separator'},
                {value: 'first_word', label: 'First word'},
                {value: 'first_letter', label: 'First letter'},
                {value: 'first_letter_lower', label: 'First letter lowercase'},
                {value: 'first_letter_upper', label: 'First letter uppercase'},
                {value: 'two_letters', label: 'Two letters'},
                {value: 'two_letters_lower', label: 'Two letters lowercase'},
                {value: 'two_letters_upper', label: 'Two letters uppercase'}
            ]
        };

        var getDialogData = function getDialogData() {
            return dialogData;
        };

        var updateTableModel = function updateTableModel(para) {
            var ret = groupfilesTableService.updateTableModel(para, getSelectedFilesAndFolders());

            gridOptions.api.setRowData(ret.rows);
            tableRows = ret.rows;
            return ret.groupCount;
        };

        var move = function move() {
            var actions = [];
            var srcPanelIndex = getSourcePanelIndex();
            var targetPanelIndex = getTargetPanelIndex();
            var i, row;
            for (i = 0; i < tableRows.length; i++) {
                row = tableRows[i];
                actions.push(
                    commandService.move({
                        bulk: tableRows.length > commandService.BULK_LOWER_LIMIT,
                        src: row.src,
                        srcPanelIndex: srcPanelIndex,
                        target: row.target,
                        targetPanelIndex: targetPanelIndex
                    })
                );
            }
            actions.push(commandService.refreshPanel(srcPanelIndex));
            actions.push(commandService.refreshPanel(targetPanelIndex));

            mainService.storeLastRowIndex();
            commandService.addActions(actions);
        };

        var copy = function copy() {
            var actions = [];
            var srcPanelIndex = getSourcePanelIndex();
            var targetPanelIndex = getTargetPanelIndex();

            var i, row;
            for (i = 0; i < tableRows.length; i++) {
                row = tableRows[i];
                actions.push(
                    commandService.copy({
                        bulk: tableRows.length > commandService.BULK_LOWER_LIMIT,
                        src: row.src,
                        srcPanelIndex: srcPanelIndex,
                        target: row.target,
                        targetPanelIndex: targetPanelIndex
                    })
                );
            }
            actions.push(commandService.refreshPanel(targetPanelIndex));

            mainService.storeLastRowIndex();
            commandService.addActions(actions);
        };

        var ret = {};
        ret.move = move;
        ret.copy = copy;
        ret.getDialogData = getDialogData;
        ret.updateTableModel = updateTableModel;
        return ret;
    }

}());