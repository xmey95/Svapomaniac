(function () {
    'use strict';

    angular
        .module('colorService', [])
        .factory('colorService', colorService);

    colorService.$inject = ['$http', '$log'];

    function colorService($http, $log) {

        var loadColorConfig = function loadColorConfig(key, callback) {
            $http
                .get('config/color/'+key+'.json')
                .then(callback);
        };

        var ret = {};
        ret.loadColorConfig = loadColorConfig;
        return ret;
    }

}());