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
        }
        BootstrapSliderDirective.prototype.link = function (scope, element, attrs, ngModelCtrl) {
            this.sliderId = 'Slider_' + BootstrapSliderDirective.sliderNumber++;
            element.attr('id', this.sliderId);
            var slider = new Slider('#' + this.sliderId, {
                step: scope.step,
                min: scope.minValue,
                max: scope.maxValue,
                tooltip: 'hide'
            });
            slider
                .on('slideStop', function (newValue) { ngModelCtrl.$setViewValue(newValue); })
                .on('slide', function (newValue) { ngModelCtrl.$setViewValue(newValue); });
            ngModelCtrl.$render = function () {
                slider.setValue(parseInt(ngModelCtrl.$viewValue), false, false);
            };
        };
        BootstrapSliderDirective.Injection = 'bootstrapSlider';
        BootstrapSliderDirective.$inject = [];
        BootstrapSliderDirective.sliderNumber = 0;
        return BootstrapSliderDirective;
    }());
    app.BootstrapSliderDirective = BootstrapSliderDirective;
    angular
        .module('app')
        .directive(BootstrapSliderDirective.Injection, app.Activator.CreateFactory(BootstrapSliderDirective));
})(app || (app = {}));
//# sourceMappingURL=bootstrap-slider-directive.js.map