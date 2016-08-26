module app {

    export class EnumDropdownDirective implements ng.IDirective {
        static Injection: string = 'enumDropdown';

        static $inject = [
            ResourceService.Injection,
            'Enums'
        ];

        public require: string = '?ngModel';
        public restrict: string = 'A';
        public replace: boolean = true;
        public template: string = '<select ng-options="value as resolve(key) for (key, value) in options" ng-change="change()"></select>';
        public scope: any = {
            enumName: '@enumDropdown',
            onChange: '&'
        };

        constructor(
            private $resources: ResourceService,
            private Enums: any
        ) {
        }

        public link(scope: any, element, attrs, ngModel) {
            var that = this;
            scope.options = this.Enums[scope.enumName];

            scope.resolve = (val) => {
                return that.$resources.resolve(val, undefined);
            };

            scope.change = () => {
                scope.onChange();
            };
        }
    }

    angular
        .module('app')
        .directive(EnumDropdownDirective.Injection, Activator.CreateFactory(EnumDropdownDirective));
}