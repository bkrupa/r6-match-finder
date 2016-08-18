module app {

    export interface BootstrapSliderScope {
        maxValue: number;
        minValue: number;
        step: number;
    }

    export class BootstrapSliderDirective implements ng.IDirective {
        static Injection: string = 'bootstrapSlider';

        static $inject = [

        ];

        public require: string = 'ngModel';
        public replace: boolean = true;
        public restrict: string = 'A';
        public template: string = '<input id="{{sliderId}}" type="text" />';
        public scope: any = {
            maxValue: '=',
            minValue: '=',
            step: '='
        };

        private static sliderNumber: number = 0;
        private sliderId: string;

        constructor(
        ) {
            this.sliderId = 'Slider_' + BootstrapSliderDirective.sliderNumber++;
        }

        public link(scope: BootstrapSliderScope, element: JQuery, attrs, ngModelCtrl: ng.INgModelController) {
            element.attr('id', this.sliderId);

            var slider: Slider = new Slider('#' + this.sliderId, {
                step: scope.step,
                min: scope.minValue,
                max: scope.maxValue
            });


            slider
                .on('slideStop', (newValue: JQueryEventObject) => { ngModelCtrl.$setViewValue(newValue); })
                .on('slide', (newValue: JQueryEventObject) => { ngModelCtrl.$setViewValue(newValue); });

            ngModelCtrl.$render = function () {
                slider.setValue(parseInt(ngModelCtrl.$viewValue), false, false);
            };

        }




        public static factory(): any {
            var directive = () => new BootstrapSliderDirective();
            directive.$inject = BootstrapSliderDirective.$inject;
            return directive;
        }
    }

    angular
        .module('app')
        .directive(BootstrapSliderDirective.Injection, BootstrapSliderDirective.factory());
}