(function () {
    'use strict';

    angular
        .module('multirenameDataService', [])
        .factory('multirenameDataService', multirenameDataService);

    multirenameDataService.$inject = ['gridiconService'];

    function multirenameDataService(gridiconService) {


        var cellClassRules = {
            'text-muted': function (params) {
                return params.data.status === 'Untouched';
            },
            'bg-danger': function (params) {
                return params.data.status === 'Error';
            },
            'font-weight-bold': function (params) {
                return params.data.status === 'OK' && params.colDef.field === 'target';
            }
        };

        var columnDefs = [
            {
                headerName: "No",
                field: "id",
                width: 60,
                icons: gridiconService.ALPHA_ICONS,
                cellClassRules: cellClassRules,
                sort: 'asc'
            },
            {
                headerName: "Old Name",
                field: "source",
                width: 400,
                icons: gridiconService.TEXT_SORT_ICONS,
                comparator: gridiconService.nameComparator,
                cellClassRules: cellClassRules,
                cellRenderer: gridiconService.fileBaseCellRenderer
            },
            {
                headerName: "Info",
                field: "status",
                width: 100,
                icons: gridiconService.TEXT_SORT_ICONS,
                cellClassRules: cellClassRules,
                sort: 'desc'
            },
            {
                headerName: "New Name",
                field: "target",
                width: 500,
                icons: gridiconService.TEXT_SORT_ICONS,
                comparator: gridiconService.nameComparator,
                cellClassRules: cellClassRules,
                cellRenderer: gridiconService.fileBaseCellRenderer
            }
        ];


        var gridOptions = {
            rowData: [],
            headerHeight: 30,
            rowHeight: 23,
            columnDefs: columnDefs,
            enableColResize: true,
            enableSorting: true,
            sortingOrder: ['asc', 'desc'],
            icons: gridiconService.ICONS
        };

        var dialogData = {
            data: {
                okEnabled: true,
                name: '[N].[E]',
                counterStart: '1',
                counterStep: '1',
                counterDigits: '4',
                replacementsChecked: false,
                replacements: [
                    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
                    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
                    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
                    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''}
                ],
                replaceGermanUmlauts: false,
                replaceRiskyChars: false,
                replaceSpaceToUnderscore: false,
                replaceParentDir: false,
                capitalizeMode: 'none',
                gridOptions: gridOptions,
                makros : [
                    {
                        cat: 'Reorder words',
                        title: 'prename name - title -> name, prename - title',
                        example: '"Sebastian Fitzek - Das Joshua-Profil.epub" -> "Fitzek, Sebastian - Das Joshua-Profil.epub"',
                        data: {
                            textFrom: '/([^.\\s\\-]+)\\s([^.\\s\-]+)\\s\\-\\s(.+)/g',
                            regExpr: true,
                            textTo: '$2, $1 - $3',
                            ifFlag: true,
                            ifMatch: '/([^,]) - ([^,]+)/'
                        }

                    },
                    {
                        cat: 'Reorder words',
                        title: 'title - prename name -> name, prename - title',
                        example: '"Das Joshua-Profil - Sebastian Fitzek.epub" -> "Fitzek, Sebastian - Das Joshua-Profil.epub"',
                        data: {
                            textFrom: '/(.+)\\s\\-\\s([^.\\s]+)\\s([^.]+)\\.([^.]+)/g',
                            regExpr: true,
                            textTo: '$3, $2 - $1.$4',
                            ifFlag: true,
                            ifMatch: '/([^,]) - ([^,]+)/'
                        }

                    },
                    {
                        cat: 'Reorder words',
                        title: 'title - lastname, prename.suffix ->  lastname, prename - title.suffix',
                        example: '"Das Joshua-Profil - Fitzek, Sebastian.epub" -> "Fitzek, Sebastian - Das Joshua-Profil.epub"',
                        data: {
                            textFrom: '/(.+)\\s\\-\\s([^.\\s]+)[\\s,]([^.]+)\\.([^.]+)/g',
                            regExpr: true,
                            textTo: '$2, $3 - $1.$4',
                            ifFlag: true,
                            ifMatch: '/([^,]) - ([^.\\s]+)[\\s,]([^.]+)/'
                        }

                    }
                ]
            },

            options: {
                digits: [
                    {value: 1, label: '1'},
                    {value: 2, label: '02'},
                    {value: 3, label: '003'},
                    {value: 4, label: '0004'},
                    {value: 5, label: '00005'},
                    {value: 6, label: '000006'},
                    {value: 7, label: '0000007'},
                    {value: 8, label: '00000008'},
                    {value: 9, label: '000000009'},
                    {value: 10, label: '0000000010'}
                ],
                starts: [
                    {value: 0, label: '0'},
                    {value: 1, label: '1'},
                    {value: 10, label: '10'},
                    {value: 100, label: '100'},
                    {value: 1000, label: '1.000'},
                    {value: 10000, label: '10.000'},
                    {value: 100000, label: '100.000'},
                    {value: 1000000, label: '1000.000'}
                ],
                steps: [
                    {value: 1, label: '1'},
                    {value: 5, label: '5'},
                    {value: 10, label: '10'},
                    {value: 20, label: '20'},
                    {value: 30, label: '50'},
                    {value: 100, label: '100'},
                    {value: 1000, label: '1.000'}
                ],
                capitalizeModes: [
                    {value: 'none', label: 'none'},
                    {value: 'uppercase', label: 'to uppercase'},
                    {value: 'lowercase', label: 'to lowercase'},
                    {value: 'capitalize_first_letter', label: 'capitalize first letter'},
                    {value: 'capitalize_words', label: 'capitalize words'},
                    {value: 'chicago_manual_of_style', label: 'chicago manual of style'}
                ]
            }
        };

        var getDialogData = function getDialogData() {
            return dialogData;
        };

        var ret = {};
        ret.getDialogData = getDialogData;
        return ret;
    }

}());