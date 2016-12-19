(function () {
    'use strict';

    angular
        .module('colorPopoverDirective', [])
        .directive('colorPopover', ColorPopoverDirective);

    ColorPopoverDirective.$inject = ['$log', '$compile'];

    // See: https://github.com/mattfarina/farbtastic
    //      https://acko.net/blog/farbtastic-jquery-color-picker-plug-in/
    // See: https://pawelgrzybek.com/css-custom-properties-explained/


    function ColorPopoverDirective($log, $compile) {

        var instanceIndex = 0;
        var farbtasticIndex = 0;

        return {
            restrict: 'E',
            scope: {
                visible: '=visible',
                target: '=target'
            },
            link: function (scope, element, attrs) {
                $(element).hide();
console.info('colorPopoverDirective...');
                var target = null;
                var colorNames = null;
                var popoverVisible= false;
                var $ele = null;
                var styles = getComputedStyle(document.documentElement);


                var getVariable = function(propertyName) {
                    return String(styles.getPropertyValue(propertyName)).trim();
                };

                var setDocumentVariable = function(propertyName, value) {
                    document.documentElement.style.setProperty(propertyName, value);
                };

                function complementHex(hexValue){
                    hexValue= hexValue.replace(/#/g, '');
                    var reqHex = "";
                    for(var i=0;i<6;i++){
                        reqHex = reqHex + (15-parseInt(hexValue[i],16)).toString(16);
                    }
                    return reqHex;
                }

                var checkPopover = function checkPopover(){
                    if (!colorNames) return;
                    if (!target) return;
                    if ($ele === null) return;

                    if (popoverVisible === true) {
console.info('checkPopover is visible'); // todo weg
                        instanceIndex++;
                        var popoverid = 'colorpopover_' + instanceIndex;
                        $.browser = {chrome:true}; // dirty workaround

                        var contentHtml = '<div id="' + popoverid + '">';
                        for (var i = 0; i < colorNames.length; i++) {
                            var name = colorNames[i];
                            contentHtml = contentHtml + '<div><small>' + name + ':</small></div>';
                            contentHtml = contentHtml +
                                '<input  type="text" name="color' + i + '" ' +
                                ' class="form-control form-control-sm color-picker" maxlength="30" ng-model="color'+ i + '" >';
                        }
                        contentHtml = contentHtml + '</div>';

                        // Step 1: parse HTML into DOM element
                        var template = angular.element(contentHtml);

                        // Step 2: compile the template
                        var linkFn = $compile(template);

                        // Step 3: link the compiled template with the scope.
                        var el = linkFn(scope);

                        // Step 4: Append to DOM (optional)
                        $(element).html(el);


                        $ele
                            .popover({
                                trigger: 'manual',
                                container: 'body',
                                html: true,
                                template: '<div class="popover colorpopover" role="tooltip"><div class="popover-arrow"></div><!--h3 class="popover-title"></h3--><div class="popover-content"></div></div>',
                                content: el
                            })
                            .popover('show')
                            .on('shown.bs.popover', function () {
                                var sel = '#' + popoverid + ' input.color-picker';

                                $(sel).each(function(i, input) {
                                    var $input = $(input);
                                    farbtasticIndex++;
                                    $input.data("tool", farbtasticIndex);

                                    return $input
                                        .popover({
                                            //title: "Colorpicker <i class='icon-remove pull-right'></i>",
                                            //trigger: "click",
                                            template: '<div class="popover colorpopover" role="tooltip"><div class="popover-arrow"></div><div class="popover-content"></div></div>',
                                            trigger: 'focus',
                                            placement: "bottom",
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

                    } else if (popoverVisible === false) {
                        $ele.popover('hide');
                    }
                };

                scope.$watch(attrs.values, function colorPopoverValuesChanged(values) {
                    if (values) {
                        colorNames = values;

                        for (var i = 0; i < colorNames.length; i++) {
                            var name = colorNames[i];
                            scope['color' + i] = getVariable(name);
                            scope['colorname' + i] = name;

                            (function(i){
                                scope.$watch('color' + i, function (value) {
                                    setDocumentVariable(scope['colorname' + i], scope['color' + i]);
                                });
                            })(i);
                        }
                    }
                    checkPopover();
                });
                scope.$watch('visible', function colorPopoverAction(value) {
                    popoverVisible = value;
                    checkPopover();
                });
                scope.$watch('target', function colorPopoverAction(value) {
                    target = value;
                    $ele = $(target);
                    checkPopover();
                });
            }
        }
    }
})();

