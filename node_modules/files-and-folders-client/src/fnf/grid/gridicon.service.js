(function () {
    'use strict';

    angular
        .module('gridiconService', [])
        .factory('gridiconService', gridiconService);

    gridiconService.$inject = [];

    function gridiconService() {
        var ret = {};

        var applyConstants = function applyConstants(scope) {

            scope.ICONS = {
                //menu: '<i class="fa fa-bars"/>',
                //columnVisible: '<i class="fa fa-eye"/>',
                //columnHidden: '<i class="fa fa-eye-slash"/>',
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                headerGroupOpened: '<i class="fa fa-minus-square-o"/>',
                headerGroupClosed: '<i class="fa fa-plus-square-o"/>'
            };

            scope.TEXT_SORT_ICONS = {
                sortAscending: '<i class="fa fa-sort-alpha-asc"/>',
                sortDescending: '<i class="fa fa-sort-alpha-desc"/>'
            };

            scope.ALPHA_ICONS = {
                sortAscending: '<i class="fa fa-sort-amount-asc"/>',
                sortDescending: '<i class="fa fa-sort-amount-desc"/>'
            };
            scope.fileCellRenderer = function fileCellRenderer(params) {
                if (!params.value) return '';

                var s1 = params.value.dir ? (params.value.dir + '/').replace(/\\/g, '/') : '';
                var s2 = params.value.base ? params.value.base : '';
                return s1 + s2;
            };
            scope.fileBaseCellRenderer = function fileBaseCellRenderer(params) {
                if (!params.value) return '';
                return params.value.base ? params.value.base : '';
            };
            scope.extCellRenderer = function extCellRenderer(params) {
                if (!params) return '';
                if (!params.data) return '';
                if (params.data.isDir) return '';
                if (params.value) return params.value;
                return '';
            };

            scope.nameCellRenderer = function nameCellRenderer(params) {
                if (!params) return '';
                if (!params.data) return '';

                if (params.data.abs) return params.data.dir + '/' + params.data.base;

                var label = params.value;
                if (!params.data.isDir) label = params.value.replace(params.data.ext, '');

                if (params.data.isDir) return '<i class="fa fa-folder"></i> [' + label + ']';
                if (params.data.error && params.data.error.code === 'EPERM') return '<i class="text-muted">' + label + '</i>';

                if (params.data.ext.match(/\.doc(x)?$/)) return '<i class="fa fa-file-word-o"></i> ' + label;
                if (params.data.ext.match(/\.epub$|\.rtf$|\.txt$/)) return '<i class="fa fa-file-text-o"></i> ' + label;
                if (params.data.ext.match(/\.pdf$/)) return '<i class="fa fa-file-pdf-o"></i> ' + label;
                if (params.data.ext.match(/\.avi$|\.mkv$|\.wmv$|\.mp(e)?g$|\.mov$|\.ram$/)) return '<i class="fa fa-file-video-o"></i> ' + label;
                if (params.data.ext.match(/\.ppt(x)?$/)) return '<i class="fa fa-file-powerpoint-o"></i> ' + label;
                if (params.data.ext.match(/\.xls(x)?$/)) return '<i class="fa fa-file-excel-o"></i> ' + label;
                if (params.data.ext.match(/\.bmp$|\.gif$|\.jpg$/)) return '<i class="fa fa-file-image-o"></i> ' + label;
                if (params.data.ext.match(/\.js$|\.java$|\.json$/)) return '<i class="fa fa-file-code-o"></i> ' + label;
                if (params.data.ext.match(/\.zip$|\.rarp$|\.7z$/)) return '<i class="fa fa-file-archive-o"></i> ' + label;
                if (params.data.ext.match(/\.mp3$|\.wav$/)) return '<i class="fa fa-file-audio-o"></i> ' + label;

                return '<i class="fa fa-file-o"></i> ' + label;
            };

            scope.sizeCellRenderer = function sizeCellRenderer(params) {
                //console.info('sizeCellRenderer...');
                if (!params) return '';
                if (!params.data) return '';
                if (params.data.status === 'temp') return '-';
                if (!params.value) {
                    if (params.data.isDir) return '&lt;DIR&gt;';
                    return '?';
                }
                return params.value.toLocaleString('en-US', {minimumFractionDigits: 0}); // todo anders formatieren?
            };

            scope.dateCellRenderer = function dateCellRenderer(params) {
                if (!params.data) return '';
                if (params.data.status === 'temp') return '-';

                if (!params.value) return '?';
                return params.value.toString().substr(0, 16).replace(/[A-Z]/g, ' ');
            };
            scope.cellClassRules = {
                'text-muted': function (params) {
                    return params.data && params.data.status === 'temp';
                },
                'fnf-long-text': function (params) {
                    return (params.data.abs && params.colDef.field === 'base');
                },
                'fnf-display-none': function (params) {
                    return (params.data.abs && params.colDef.field !== 'base');
                },
                'text-success': function (params) {
                    return (params.data.isWalking && params.colDef.field === 'size');
                }
            };

            scope.nameComparator = function nameComparator(value1, value2, row1, row2, isInverted) {
                var f = isInverted ? -1 : 1;

                if (!row1) return f;
                if (!row2) return -f;

                if (!value1) return f;
                if (!value2) return -f;

                if (!row1.data) return f;
                if (!row2.data) return -f;

                var u1 = value1.toUpperCase();
                var u2 = value2.toUpperCase();


                if (row1.data.isDir && !row2.data.isDir) return -f;
                if (!row1.data.isDir && row2.data.isDir) return f;

                if (row1.data.isDir && row2.data.isDir) return u1.localeCompare(u2);

                return u1.localeCompare(u2);
            };

            scope.sizeComparator = function sizeComparator(value1, value2, row1, row2, isInverted) {
                var f = isInverted ? -1 : 1;

                if (!row1) return f;
                if (!row2) return -f;

                if (!value1) return f;
                if (!value2) return -f;

                if (!row1.data) return f;
                if (!row2.data) return -f;

                var u1 = row1.data.base.toUpperCase();
                var u2 = row2.data.base.toUpperCase();

                if (row1.data.isDir && !row2.data.isDir) return -f;
                if (!row1.data.isDir && row2.data.isDir) return f;

                if (row1.data.isDir && row2.data.isDir) return u1.localeCompare(u2);

                return value1 - value2;
            };

            return ret;
        };

        applyConstants(ret);

        ret.applyConstants = applyConstants;

        return ret;
    }

}());