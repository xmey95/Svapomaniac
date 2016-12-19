(function () {
    'use strict';

    angular
        .module('colorconfigService', [])
        .factory('colorconfigService', colorconfigService);

    colorconfigService.$inject = ['mainService', 'gridiconService', 'commandService', '$log'];

    function colorconfigService(mainService, gridiconService, commandService, $log) {
        $log.info('colorconfigService...');

        var customColorKeys = [
           "primary-color", // #000;
           "primary-background-color", // #fff;
           "primary-background-bit-different-color", // #f0f8ff;
           "secondary-background-color", // #f3f3f3;
           "secondary-color", // #222;
           "secondary-muted-color", // #000;
           "button-secondary-background-color", // #fff;
           "header-link-color", // #000;
           "header-link-bit-different-color", // #666;
           "header-link-selected-color", // #0098db;
           "header-fav-star-selected-color", // #ff00ff;

           "nav-tabs-border-color", // rgb(210, 210, 210);
           "item-selected-color", // #e00034;
           "item-muted-color", // #bbb;

           "cursor-row-background-color", // #0098db;
           "cursor-row-color", // #fff;

           "dropdown-focussed-background-color", // #eee;

           "footer-primary-background-color", // #f3f3f3;
           "footer-primary-color", // var(--primary-color);
           "footer-filecount-background-color", // var(--footer-primary-background-color);
           "footer-filecount-color", // var(--secondary-color);
           "footer-btn-secondary-background-color", // #5c5d63;
           "footer-btn-secondary-border-color", // #000;
           "footer-btn-secondary-color", // #fff;



           "tooltip-background-color", // rgba(0,0,0,0.75);
           "tooltip-color", // #fff;
           "tooltip-background-input-color", // #fff;
           "tooltip-input-color", // #000;

           "scrollbar-track-background", // #fff;
           "scrollbar-thumb-background", // #d2d2d2;
           "scrollbar-thumb-border-color", // #fff;
           "scrollbar-thumb-active-background" // #888;
        ];

        var getCustomcolorKeys = function getCustomcolorKeys(){
            return customColorKeys;
        };

        var getVariable = function(propertyName) {
            var styles = getComputedStyle(document.documentElement);
            return String(styles.getPropertyValue(propertyName)).trim().replace(/\\3/g, '').replace(/ /g, '');
        };

        var setDocumentVariable = function(propertyName, value) {
            document.documentElement.style.setProperty(propertyName, value);
        };
        
        var ret = {};
        ret.getCustomcolorKeys = getCustomcolorKeys;
        ret.getVariable = getVariable;
        ret.setDocumentVariable = setDocumentVariable;
        return ret;
    }

}());