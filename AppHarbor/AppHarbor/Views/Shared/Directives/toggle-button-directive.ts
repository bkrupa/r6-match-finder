module app {


    export class ToggleButtonDirective implements ng.IDirective {
        static Injection: string = 'toggleButton';

        static $inject = [
            ResourceService.Injection
        ];

        public require: string = 'ngModel';
        public replace: boolean = false;
        public restrict: string = 'A';
        public template: string = '<div class="btn-group" data-toggle="buttons">' +
        '<button type="button" class="btn btn-secondary btn-sm" ng-class="{active: !value}" ng-click="setValue(false)">{{falseText}}</button>' +
        '<button type="button" class="btn btn-secondary btn-sm" ng-class="{active: value}" ng-click="setValue(true)" >{{trueText}}</button>' +
        '</div>';
        public scope: any = {
            trueText: '@',
            falseText: '@'
        };


        constructor(
            private $resources: ResourceService
        ) {

        }

        public link(scope: any, element: JQuery, attrs, ngModelCtrl: ng.INgModelController) {
            if (!scope.falseText) {
                this.$resources.load('NO').then((result) => {
                    scope.falseText = result;
                });
            }

            if (!scope.trueText) {
                this.$resources.load('YES').then((result) => {
                    scope.trueText = result;
                });
            }

            scope.setValue = (newValue) => {
                scope.value = newValue;
                ngModelCtrl.$setViewValue(newValue);
            };


            ngModelCtrl.$render = function () {
                scope.value = ngModelCtrl.$viewValue || false;
            };
        }
    }

    angular
        .module('app')
        .directive(ToggleButtonDirective.Injection, Activator.CreateFactory(ToggleButtonDirective));
}