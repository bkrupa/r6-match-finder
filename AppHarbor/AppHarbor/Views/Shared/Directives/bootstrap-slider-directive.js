var app;
(function (app) {
    var BootstrapSliderDirective = (function () {
        function BootstrapSliderDirective() {
            this.require = 'ngModel';
            this.replace = true;
            this.restrict = 'A';
            this.template = '<input id="{{sliderId}}" type="text" />';
            this.scope = {
                maxValue: '=',
                minValue: '=',
                step: '='
            };
            this.sliderId = 'Slider_' + BootstrapSliderDirective.sliderNumber++;
        }
        BootstrapSliderDirective.prototype.link = function (scope, element, attrs, ngModelCtrl) {
            element.attr('id', this.sliderId);
            var slider = new Slider('#' + this.sliderId, {
                step: scope.step,
                min: scope.minValue,
                max: scope.maxValue
            });
            slider
                .on('slideStop', function (newValue) { ngModelCtrl.$setViewValue(newValue); })
                .on('slide', function (newValue) { ngModelCtrl.$setViewValue(newValue); });
            ngModelCtrl.$render = function () {
                slider.setValue(parseInt(ngModelCtrl.$viewValue), false, false);
            };
        };
        BootstrapSliderDirective.factory = function () {
            var directive = function () { return new BootstrapSliderDirective(); };
            directive.$inject = BootstrapSliderDirective.$inject;
            return directive;
        };
        BootstrapSliderDirective.Injection = 'bootstrapSlider';
        BootstrapSliderDirective.$inject = [];
        BootstrapSliderDirective.sliderNumber = 0;
        return BootstrapSliderDirective;
    }());
    app.BootstrapSliderDirective = BootstrapSliderDirective;
    angular
        .module('app')
        .directive(BootstrapSliderDirective.Injection, BootstrapSliderDirective.factory());
})(app || (app = {}));
