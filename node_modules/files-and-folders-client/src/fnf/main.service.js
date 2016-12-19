(function () {
    'use strict';

    angular
        .module('mainService', [])
        .factory('mainService', mainService);

    mainService.$inject = [
        'dataService',
        'gridService',
        'tabService',
        'folderService',
        'historyService',
        'openfileActionService',
        'shellActionService'
    ];

    function mainService(dataService, gridService, tabService, folderService, historyService, openfileActionService, shellActionService) {
        var ret = {};

        var getGridApi = gridService.getGridApi;
        var getGridOptions = gridService.getGridOptions;
        var getGridModel = gridService.getGridModel;

        var getActiveTab = tabService.getActiveTab;
        var getTabCount = tabService.getTabCount;
        var getTabs = tabService.getTabs;
        var selectPanel = tabService.selectPanel;

        var openFile = openfileActionService.openFile;
        var shellExecute = shellActionService.execute;

        var data = dataService.getData();

        var runTool = function runTool(tool){
            var cmds = [];
            var i;
            var cmd = tool.cmd;
            if (tool.para) cmd = cmd + tool.para;

            if (cmd.indexOf('$file')>-1) {
                var files = getSelectedFiles();
                var fileLimit = tool.fileLimit;
                if (!fileLimit) fileLimit = 10;

                if (files.length===0) {
                    var row = getFirstPossibleRow();
                    if (row) files.push(row);
                }

                for (i = 0; i < files.length && i < fileLimit; i++) {
                    var file = files[i].dir + '/' + files[i].base;
                    cmds.push(cmd.replace(/\$file/g, file));
                }
            }
            if (cmds.length === 0) cmds.push(cmd);

            if (cmd.indexOf('$dir')>-1) {
                var currentDir = getSourceDir();
                for (i = 0; i < cmds.length; i++) {
                    cmds[i] = cmds[i].replace(/\$dir/g, currentDir);
                }
            }
            shellExecute(cmds);
        };

        var navigateBack = function navigateBack() {
            var folder = historyService.getPrevFolder(getSourceDir());
            if (folder) {
                setFolder(getSourcePanelIndex(), folder);
            }
        };
        var navigateDown = function navigateDown() {
            var path = getSourceDir().replace(/\\/g, '/');
            if (path.indexOf('/') > -1) {
                var pp = path.split('/');
                var newpath = pp.slice(0, pp.length - 1).join('/');
                setFolder(getSourcePanelIndex(), newpath);
            }
        };

        var getTargetPanelIndex = function getTargetPanelIndex() {
            return Math.abs(data.activePanelIndex - 1);
        };
        var getSourcePanelIndex = function getSourcePanelIndex() {
            return data.activePanelIndex;
        };
        var getTargetTab = function getTargetTab() {
            return getActiveTab(getTargetPanelIndex());
        };
        var getSourceTab = function getSourceTab() {
            return getActiveTab(getSourcePanelIndex());
        };
        var getTab = function getTab(panelIndex) {
            return getActiveTab(panelIndex);
        };

        var getSourceDir = function getSourceDir() {
            return getSourceTab().path;
        };
        var getTargetDir = function getTargetDir() {
            return getTargetTab().path;
        };
        var getDir = function getDir(panelIndex) {
            return getTab(panelIndex).path;
        };

        var getTargetGridApi = function getTargetGridApi() {
            return getGridApi(getTargetPanelIndex());
        };
        var getSourceGridApi = function getSourceGridApi() {
            return getGridApi(getSourcePanelIndex());
        };

        var getTargetGridOptions = function getTargetGridOptions() {
            return getGridOptions(getTargetPanelIndex());
        };
        var getSourceGridOptions = function getSourceGridOptions() {
            return getGridOptions(getSourcePanelIndex());
        };

        var getTargetGridModel = function getTargetGridModel() {
            return getGridModel(getTargetPanelIndex());
        };
        var getSourceGridModel = function getSourceGridModel() {
            return getGridModel(getSourcePanelIndex());
        };

        // -------------------------------------------------------
        var getRowsForAction = function getRowsForAction() {
            var rows = getSourceGridApi().getSelectedRows();
            if (rows && rows.length) return rows;

            var row = getFocusedRow();
            if (row) return [row];

            return [];
        };

        var getSelectedRows = function getSelectedRows() {
            return getSourceGridApi().getSelectedRows();
        };

        var getFirstSelectedItem = function getFirstSelectedItem() {
            var rows = getSelectedRows();
            if (rows.length > 0) return rows[0];
            return null;
        };

        var getFocusedRow = function getFocusedRow() {
            var api = getSourceGridApi();
            var cell = api.getFocusedCell();
            if (!cell) return null;
            return cell.node.data;
        };

        var getFirstPossibleRow = function getFirstPossibleRow() {
            var row = getFirstSelectedItem();
            if (row) {
                return row;
            }

            row = getFocusedRow();
            if (row) {
                return row;
            }

            var api = getSourceGridApi();
            var rowData = api.grid.gridOptions.rowData;
            if (rowData && rowData.length > 0) {
                return rowData[0];
            }

            return null;
        };

        var getSelectedFiles = function getSelectedFiles() {
            var rows = getSelectedRows();
            var ret = [];
            for (var i = 0; i < rows.length; i++) {
                if (!rows[i].isDir) {
                    ret.push(rows[i]);
                    //ret.push({
                    //    dir: rows[i].dir,
                    //    base: rows[i].base
                    //});
                }
            }
            return ret;
        };

        var getSelectedFilesAndFolders = function getSelectedFilesAndFolders() {
            var rows = getSelectedRows();
            var ret = [];
            for (var i = 0; i < rows.length; i++) {
                ret.push(rows[i]);
                //ret.push({
                //    dir: rows[i].dir,
                //    base: rows[i].base
                //});
            }
            return ret;
        };

        var getSelectedAbsoluteFolders = function getSelectedAbsoluteFolders() {
            var rows = getSelectedRows();
            var ret = [];
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].isDir) {
                    ret.push(rows[i].dir + '/' + rows[i].base);
                }
            }
            return ret;
        };

        var getSelectedCount = function getSelectedCount() {
            var rows = getSelectedRows();
            return rows.length;
        };

        // -------------------------------------------------------

        var getPossibleTargetFolders = function getPossibleTargetFolders() {
            var ret = [];
            var sourceDir = getSourceDir();
            var i;
            var add = function add(p){
                p = slash(p);
                if (p != sourceDir  && ret.indexOf(p) === -1) ret.push(p);
            };

            add(getTargetTab().path);

            // add FAVs
            for (i = 0; i < data.favs.length; i++) {
                add(data.favs[i]);
            }

            // target tabs:
            var tabs = getTabs(getTargetPanelIndex());
            for (i = 0; i < tabs.length; i++) {
                add(tabs[i].path);
            }
            // source tabs:
            tabs = getTabs(getSourcePanelIndex());
            for (i = 0; i < tabs.length; i++) {
                add(tabs[i].path);
            }
            // folder history;
            for (i = 0; i < data.folderHistory.length; i++) {
                add(data.folderHistory[i]);
            }

            return ret;
        };

        var getFolderHistory = function getFolderHistory() {
            return data.folderHistory;
        };

        var slash = function slash(s) {
            if (!s) return null;
            return s.replace(/\\/g, '/');
        };

        // -------------------------------------------------------
        var loadDirectory = function (panelIndex, opt) {
            var setFocus = function setFocus(){
                selectPanel(panelIndex);
            };

            folderService.loadDirectory(panelIndex, opt, setFocus);
        };

        var storeLastRowIndex =  function storeLastRowIndex(){
            getGridOptions(getSourcePanelIndex()).lastRowIndex = getFirstPossibleRowIndex();
        };

        var getFirstPossibleRowIndex = function getFirstPossibleRowIndex() {
            var api = getSourceGridApi();
            var cell = api.getFocusedCell();
            if (cell) return cell.rowIndex;

            var nodes = api.getSelectedNodes();
            if (nodes && nodes.length>0) {
                return nodes[0].childIndex;
            }

            return 0;
        };

        // ---------------------------------------------------------

        var onTabDblclicked = function onTabDblclicked(panelIndex, tab) {
            tabService.onTabDblclicked(panelIndex, tab, function (newActiveTab) {
                loadDirectory(panelIndex, {path: newActiveTab.path});
            });
        };
        var onTabClicked = function onTabClicked(panelIndex, tab) {
            tabService.onTabClicked(panelIndex, tab, function (panelIndex, tab) {
                loadDirectory(panelIndex, {path: tab.path, fileList: tab.fileList});
            });
        };
        var addTab = function addTab(panelIndex) {
            tabService.addTab(panelIndex, function (panelIndex, tab) {
                loadDirectory(panelIndex, {path: tab.path});
            });
        };
        var addNewTabOnActivePanel = function addNewTabOnActivePanel() {
            addTab(getSourcePanelIndex());
        };
        var removeTabOnActivePanel = function removeTabOnActivePanel() {
            var panelIndex = getSourcePanelIndex();
            if (getTabCount(panelIndex) > 1) {
                onTabDblclicked(panelIndex, getSourceTab());
            }
        };
        var reload = function reload(panelIndex) {
            var tab = getActiveTab(panelIndex);
            if (!tab.fileList) {
                loadDirectory(panelIndex, {path: getActiveTab(panelIndex).path, nocache: true});
            }
        };

        // -------------------------------------------------------

        var onHomePressed = function onHomePressed(){
            var api = getSourceGridApi();
            api.setFocusedCell(0, 0);
        };
        var onEndPressed = function onEndPressed(){
            var api = getSourceGridApi();
            var gridOptions = getSourceGridOptions();
            api.setFocusedCell(gridOptions.rowData.length-1, 0);
        };
        var onPageUpPressed = function onPageUpPressed(){
            var api = getSourceGridApi();
            var cell = api.getFocusedCell();
            if (!cell) return;

            var gridOptions = getSourceGridOptions();
            var rc = getVisibleRowCount(gridOptions);
            var r = cell.rowIndex - rc + 1;

            r = Math.max(0, Math.min(gridOptions.rowData.length-1 ,r));
            api.setFocusedCell(r, 0);
        };
        var onPageDownPressed = function onPageDownPressed(){
            var api = getSourceGridApi();
            var cell = api.getFocusedCell();
            if (!cell) return;

            var gridOptions = getSourceGridOptions();
            var rc = getVisibleRowCount(gridOptions);
            var r = cell.rowIndex + rc -1;

            r = Math.max(0, Math.min(gridOptions.rowData.length-1 ,r));
            api.setFocusedCell(r, 0);
        };
        var getVisibleRowCount = function getVisibleRowCount(gridOptions){
            var api = gridOptions.api;
            var h = $(api.gridPanel.eBody).height(); // dirty
            var ret = (h - gridOptions.headerHeight * 0.00000001) / gridOptions.rowHeight;

            ret = parseInt(''+ret);
            return ret;
        };
        var onEnterPressed = function onEnterPressed(){
            var row = getFirstPossibleRow();
            if (row) {
                var fullName = row.dir + '/' + row.base;
                if (row.isDir) {
                    var panelIndex = getSourcePanelIndex();
                    setFolder(panelIndex, fullName);
                } else {
                    openFile(fullName);
                }
            }
        };

        /**
         * Toggle selection of current (focussed) row and focus next row.
         */
        var toggleCurrentRow = function toggleCurrentRow(){
            var api = getSourceGridApi();
            var gridOptions = getSourceGridOptions();
            var cell = api.getFocusedCell();
            if (!cell) return;

            var r = cell.rowIndex;
            var node = cell.node;

            var b = api.isNodeSelected(node);
            if (b) {
                api.deselectNode(node, false);
            } else {
                api.selectNode(node, true, false);
            }
            r++;
            r = Math.max(0, Math.min(gridOptions.rowData.length-1 ,r));
            api.setFocusedCell(r, 0);
        };


        // -------------------------------------------------------

        var setFolder = function setFolder(panelIndex, folder, callback) {
            var ps = slash(folder).split('/');
            var tab = tabService.getActiveTab(panelIndex);
            tab.path = folder;
            tab.label = ps[ps.length - 1];

            loadDirectory(panelIndex, {path: folder}, callback);
        };

        // -------------------------------------------------------
        // see http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable

        var fileSizeSI = function fileSizeSI(a, b, c, d, e) {
            //kB,MB,GB,TB,PB,EB,ZB,YB
            return (b = Math, c = b.log, d = 1e3, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes')
        };

        var fileSizeIEC = function fileSizeIEC(a, b, c, d, e) {
            //KiB,MiB,GiB,TiB,PiB,EiB,ZiB,YiB
            return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'KMGTPEZY'[--e] + 'iB' : 'Bytes')
        };
        // -------------------------------------------------------

        ret.onHomePressed = onHomePressed;
        ret.onEndPressed = onEndPressed;
        ret.onPageUpPressed = onPageUpPressed;
        ret.onPageDownPressed = onPageDownPressed;

        ret.storeLastRowIndex = storeLastRowIndex;
        ret.onEnterPressed = onEnterPressed;
        ret.toggleCurrentRow = toggleCurrentRow;
        ret.runTool = runTool;
        ret.openFile = openFile;
        ret.fileSizeSI = fileSizeSI;
        ret.fileSizeIEC = fileSizeIEC;
        ret.loadDirectory = loadDirectory;
        ret.setFolder = setFolder;
        ret.onTabDblclicked = onTabDblclicked;
        ret.onTabClicked = onTabClicked;
        ret.addTab = addTab;
        ret.addNewTabOnActivePanel = addNewTabOnActivePanel;
        ret.removeTabOnActivePanel = removeTabOnActivePanel;
        ret.reload = reload;

        ret.navigateDown = navigateDown;
        ret.navigateBack = navigateBack;

        ret.getTargetPanelIndex = getTargetPanelIndex;
        ret.getSourcePanelIndex = getSourcePanelIndex;

        ret.getTargetTab = getTargetTab;
        ret.getSourceTab = getSourceTab;
        ret.getTab = getTab;

        ret.getTargetDir = getTargetDir;
        ret.getSourceDir = getSourceDir;
        ret.getDir = getDir;

        ret.getTargetGridApi = getTargetGridApi;
        ret.getSourceGridApi = getSourceGridApi;

        ret.getTargetGridOptions = getTargetGridOptions;
        ret.getSourceGridOptions = getSourceGridOptions;

        ret.getTargetGridModel = getTargetGridModel;
        ret.getSourceGridModel = getSourceGridModel;

        ret.getFocusedRow = getFocusedRow;
        ret.getRowsForAction = getRowsForAction;
        ret.getSelectedRows = getSelectedRows;
        ret.getSelectedFiles = getSelectedFiles;
        ret.getSelectedFilesAndFolders = getSelectedFilesAndFolders;
        ret.getSelectedAbsoluteFolders = getSelectedAbsoluteFolders;
        ret.getSelectedCount = getSelectedCount;
        ret.getFirstSelectedItem = getFirstSelectedItem;
        ret.getFirstPossibleRow = getFirstPossibleRow;

        ret.getFolderHistory = getFolderHistory;
        ret.getPossibleTargetFolders = getPossibleTargetFolders;

        ret.slash = slash;

        return ret;
    }

}());