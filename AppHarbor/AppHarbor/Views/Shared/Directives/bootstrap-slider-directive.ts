﻿module app {

    export interface BootstrapSliderScope extends ng.IScope {
        maxValue: number;
        minValue: number;
        step: number;
        ticks: Array<number>;
        tickBounds: number;
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
            step: '=',
            ticks: '=',
            tickBounds: '=',
            disabled: '='
        };

        private static sliderNumber: number = 0;
        private sliderId: string;

        constructor(
        ) {

        }

        public link(scope: BootstrapSliderScope, element: JQuery, attrs, ngModelCtrl: ng.INgModelController) {
            this.sliderId = 'Slider_' + BootstrapSliderDirective.sliderNumber++;
            element.attr('id', this.sliderId);

            var slider: Slider = new Slider('#' + this.sliderId, {
                step: scope.step,
                min: scope.minValue,
                max: scope.maxValue,
                tooltip: 'hide',
                ticks: scope.ticks,
                ticks_snap_bounds: scope.tickBounds
            });

            slider
                .on('slideStop', (newValue: JQueryEventObject) => { ngModelCtrl.$setViewValue(newValue); })
                .on('slide', (newValue: JQueryEventObject) => { ngModelCtrl.$setViewValue(newValue); });

            ngModelCtrl.$render = function () {
                slider.setValue(parseInt(ngModelCtrl.$viewValue), false, false);
            };

            scope.$watch('disabled', (newValue, oldValue) => {
                if (newValue)
                    slider.disable();
                else
                    slider.enable();
            });

        }
    }

    angular
        .module('app')
        .directive(BootstrapSliderDirective.Injection, Activator.CreateFactory(BootstrapSliderDirective));
}