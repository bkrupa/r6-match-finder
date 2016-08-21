module app {


    export class RadioButtonGroupDirective implements ng.IDirective {
        static Injection: string = 'radioButtonGroup';

        static $inject = [

        ];

        public require: string = 'ngModel';
        public replace: boolean = false;
        public restrict: string = 'A';
        public template: string = '<div class="btn-group" data-toggle="buttons">' +
        '<button type="button" class="btn btn-primary" ng-if="showNull" ng-class="{active: value == null}" ng-click="setValue(null)">{{nullText}}</button>' +
        '<button type="button" class="btn btn-primary" ng-class="{active: value == i}" ng-click="setValue(i)" ng-repeat="i in getValues()" >{{i}}</button>' +
        '</div>';
        public scope: any = {
            count: '=',
            start: '=',
            nullText: '@',
            showNull: '='
        };


        constructor(
        ) {
        }

        public link(scope: any, element: JQuery, attrs, ngModelCtrl: ng.INgModelController) {
            scope.getValues = () => {
                return Utilities.Range(scope.count || 0, scope.start);
            }

            scope.setValue = (newValue) => {
                scope.value = newValue;
                ngModelCtrl.$setViewValue(newValue);
            };


            ngModelCtrl.$render = function () {
                scope.value = ngModelCtrl.$viewValue;
            };

        }
    }

    angular
        .module('app')
        .directive(RadioButtonGroupDirective.Injection, Activator.CreateFactory(RadioButtonGroupDirective));
}