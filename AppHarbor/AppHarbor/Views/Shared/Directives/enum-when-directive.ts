module app {
    export class EnumWhenDirective implements ng.IDirective {
        static Injection: string = 'enumWhen';
        static $inject = [
            'Enums'
        ];

        public require: string = 'ngModel';
        public restrict: string = 'A';
        public transclude: boolean = true;
        public template: string = '<div ng-if="visible" ng-transclude></div>';
        public scope: any = {
            enumWhen: '@'
        };

        public constructor(private Enums: any)
        { }

        public link(scope: any, elem: JQuery, attr: any, ngModel: ng.INgModelController) {
            var values = scope.enumWhen.split('.');
            var value = this.Enums;

            for (var i = 0; value && i < values.length; i++)
                value = value[values[i]];

            scope.visible = false;
            ngModel.$render = function () {
                scope.visible = ngModel.$viewValue == value;
            };
        }
    }

    angular
        .module('app')
        .directive(EnumWhenDirective.Injection, Activator.CreateFactory(EnumWhenDirective));
}
