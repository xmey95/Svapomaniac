(function () {
    'use strict';

    angular
        .module('dialogService', [])
        .factory('dialogService', DialogService);

    DialogService.$inject = ['$rootScope',
        '$templateCache',
        '$compile',
        'appKeyboardService',
        '$log',
        '$timeout'];

    /**
     * Die aktuelle Version setzt einen bereits gefüllten $templateCache voraus!
     */
    function DialogService($rootScope, $templateCache, $compile, appKeyboardService, $log, $timeout) {
        var idDlgMap = {};

        var generateUuid = function generateUuid() {
            var now = typeof Date.now === 'function' ? Date.now() : new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (now + Math.random() * 16) % 16 | 0;
                now = Math.floor(now / 16);
                return (c === 'x' ? r : r & 7 | 8).toString(16);
            });
            return uuid;
        };

        var openAndCompile = function openAndCompile(dialog, options) {
            if (angular.isString(dialog)) {
                options = {url: dialog};
            } else {
                // call is openAndCompile(({...})
                options = dialog;
            }
            if (!options) options = {backdrop: 'static'};
            if (!options.id) options.id = 'dialog-' + generateUuid();
            if (!options.url) throw Error('DialogService.open(...): url is missing!');

            var dlg = getDialog(options);

            var keyCombo = {
                keys: 'control enter',
                on_keydown: function () {
                    if (dlg.find('[fnf-click-on-ctrl-enter]').length === 1) {
                        dlg.find('[fnf-click-on-ctrl-enter]').click();

                    } else if (dlg.find('.btn-primary').length === 1) {
                        dlg.find('.btn-primary').click();
                    }
                },
                prevent_default   : true,
                is_exclusive   : true
            };
            dlg.on('show.bs.modal', function () {
                if (options.onShow) options.onShow(dlg);
            });
            dlg.on('shown.bs.modal', function () {
                $(':input[autofocus]', this).focus();
                if (options.onShown) options.onShown(dlg);
                appKeyboardService.unregisterMainShortcuts();
                appKeyboardService.register_combo(keyCombo);
                dlg.find('[fnf-click-on-ctrl-enter]').attr('title', 'Press Ctrl-Enter');
                dlg.find('[data-dismiss]').attr('title', 'Press ESC');
            });
            dlg.on('hidden.bs.modal', function () {
                if (options.onHidden) options.onHidden(dlg);
                $log.info('modal closed.', options.id);
                appKeyboardService.unregister_combo(keyCombo.keys);
                appKeyboardService.reregisterMainShortcuts();
                if (options.nocache) dlg.parent().remove();
            });
            dlg.modal(options);

            return dlg;
        };

        var getDialog = function getDialog(options) {
            var id = options.id;
            var dlgUrl = options.url;
            var nocache = options.nocache ? true : false;
            // $log.info('getDialog ' + id, options);
            if (!nocache && idDlgMap[id]) {
                $log.info('from map ', id);
                return idDlgMap[id];
            }
            $('body').append('<div id="' + id + '"></div>');
            var targetDom = $('#' + id);
            var html = $templateCache.get(dlgUrl);
            targetDom.append(html);
            var scope = targetDom.html(html).scope();
            $compile(targetDom)(scope || $rootScope);

            var dlg = $('#' + id + ' div:first');
            idDlgMap[id] = dlg;
            return dlg;
        };

        var ret = {};
        ret.iam = 'dialogService';
        ret.openAndCompile = openAndCompile;
        return ret;
    }

}());