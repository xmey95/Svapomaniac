(function () {
    'use strict';

    angular
        .module('app')
        .controller('GridPopupController', GridPopupController);

    GridPopupController.$inject = ['notifyService', '$timeout', '$log'];

    function GridPopupController(notifyService, $timeout, $log) {
        $log.info('GridPopupController...');

        var vm = this;

        var popupMenu = function popupMenu(e, panelIndex) {
            // dirty1 --> TODO  directive!
            console.info(e);
            var srcEle = e.target ? e.target : e.srcElement;
            var poupEle = $('#gridPopup');

            $(srcEle).click();

            $timeout(function(){
                poupEle.addClass('open'); //.css(cssPos);

                new Tether({
                    element: poupEle,
                    target: srcEle,
                    attachment: 'middle left',
                    targetAttachment: 'middle left'
                });
            }, 111);
        };

        notifyService
            .addListener('SHOW_POPUP', function (obj, key) {
                popupMenu(obj.event, obj.panelIndex);
            });
    }

})();