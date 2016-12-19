(function () {
    'use strict';

    angular
        .module('ColorconfigController', [])
        .controller('ColorconfigController', ColorconfigController);

    ColorconfigController.$inject = ['colorconfigService', 'notifyService', '$log', '$scope', '$timeout'];

    function ColorconfigController(colorconfigService, notifyService, $log, $scope, $timeout) {
        $log.info('ColorconfigController...');

        var vm = this;
        vm.data = {};

        vm.getCustomcolorKeys = colorconfigService.getCustomcolorKeys;
        var getVariable = colorconfigService.getVariable;
        var setDocumentVariable = colorconfigService.setDocumentVariable;

        var farbtasticIndex = 0;

        var init = function init() {
            $log.info('ColorconfigController.init()...');
            var keys = vm.getCustomcolorKeys();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var color = getVariable('--' + key);
                vm.data[key] = color;
                $log.info(key, color);

                (function(key){
                    $scope.$watch(
                        function watchFoo($scope) {
                            return( vm.data[key] );
                        },
                        function handleFooChange(newValue, oldValue ) {
                            if (newValue) setDocumentVariable('--' + key, newValue);
                        }
                    );
                })(key);
            } // for
            $log.info('vm', vm);

            $timeout(function() {
                var sel = '#fnf-colorconfig-action-dialog input.color-picker';
                $.browser = {chrome:true}; // dirty workaround
                $(sel).each(function(i, input) {
                    var $input = $(input);
                    farbtasticIndex++;
                    $input.data("tool", farbtasticIndex);

                    var color = $input.val();
                    if (color) {
                        var ch = complementHex(color);
                        $input
                            .css("background-color", color)
                            .css("color", '#' + ch);
                    }
                    return $input
                        .popover({
                            //title: "Colorpicker <i class='icon-remove pull-right'></i>",
                            //trigger: "click",
                            template: '<div class="popover colorpopover" role="tooltip"><div class="popover-arrow"></div><div class="popover-content"></div></div>',
                            trigger: 'focus',
                            placement: i>10 ? "top": "right", // "bottom",
                            html: true,
                            content: "<div id='colorpicker-" + $input.data("tool") + "'><div class='color-picker'></div></div>"
                        })
                        .on("click", function () {
                            var targetSel = "#colorpicker-" + $input.data("tool");
                            var picker = $.farbtastic(targetSel, {});
                            picker.setColor($input.val());
                            picker.linkTo(function(color){
                                var ch = complementHex(color);
                                console.info('color', color);
                                console.info('ch', ch);
                                $input
                                    .val(color)
                                    .change()
                                    .css("background-color", color)
                                    .css("color", '#'+ch);
                            });
                        });
                });
            });
        };

        var complementHex = function complementHex(hexValue){
            hexValue= hexValue.replace(/#/g, '');
            var reqHex = "";
            for(var i=0;i<6;i++){
                reqHex = reqHex + (15-parseInt(hexValue[i],16)).toString(16);
            }
            return reqHex;
        };

        notifyService
            .removeListenersForKey('OPEN_COLORCONFIG_DLG_ON_SHOW')
            .removeListenersForKey('OPEN_COLORCONFIG_DLG_ON_SHOWN')
            .removeListenersForKey('OPEN_COLORCONFIG_DLG_ON_HIDDEN')
            .addListener('OPEN_COLORCONFIG_DLG_ON_SHOW', init);
        //.addListener('OPEN_COLORCONFIG_DLG_ON_HIDDEN', cancelWalk);
    }

})();