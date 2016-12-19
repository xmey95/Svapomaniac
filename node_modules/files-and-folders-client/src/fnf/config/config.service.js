(function () {
    'use strict';

    angular
        .module('configService', [])
        .factory('configService', ConfigService);

    ConfigService.$inject = ['mainService', 'dataService', 'socketService', '$log'];

    function ConfigService(mainService, dataService, socketService, $log) {
        var ret = {};

        var removeProperties = function removeProperties(obj, names) {
            var i, key;
            if (angular.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    removeProperties(obj[i], names);
                }
            } else if (angular.isObject(obj)) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var o = obj[key];
                        if (angular.isArray(o) || angular.isObject(o)) {
                            removeProperties(o, names);
                        } else {
                            for (i = 0; i < names.length; i++) {
                                if (key === names[i]) {
                                    delete obj[key];
                                }
                            }
                        }
                    }
                }
            }
        };

        var isFav = function isFav(dir) {
            var _data = dataService.getData();
            if (!_data.favs) return false;
            return _data.favs.indexOf(dir) > -1;
        };
        var unfav = function unfav(dir) {
            var _data = dataService.getData();
            if (!_data.favs) return;
            var idx = _data.favs.indexOf(dir);
            if (idx > -1) {
                _data.favs.splice(idx, 1);
            }
            saveConfig();
        };
        var fav = function fav(dir) {
            var _data = dataService.getData();
            if (!_data.favs) _data.favs = [];
            var idx = _data.favs.indexOf(dir);
            if (idx > -1) {
                _data.favs.splice(idx, 1);
            }
            _data.favs.push(dir);
            saveConfig();
        };

        var saveConfig = function saveConfig() {
            var _data = dataService.getData();
            console.info(_data.colorname);
            var configData = {
                activePanelIndex: mainService.getSourcePanelIndex(),
                tabs: JSON.parse(JSON.stringify(_data.tabs)),
                folderLatestAdded: JSON.parse(JSON.stringify(_data.folderLatestAdded)),
                favs: JSON.parse(JSON.stringify(_data.favs)),
                colorname: _data.colorname
            };
            removeProperties(configData.tabs, ['$$hashKey']);
            removeProperties(configData.folderLatestAdded, ['$$hashKey']);
            removeProperties(configData.favs, ['$$hashKey']);
            //removeProperties(configData.color, ['$$hashKey']);

            socketService.emit('saveconfig', {
                username: _data.initial.username,
                data: configData
            }, function (error, d) {
            });
            return ret;
        };


        ret.saveconfig = saveConfig;
        ret.fav = fav;
        ret.unfav = unfav;
        ret.isFav = isFav;
        return ret;
    }

}());