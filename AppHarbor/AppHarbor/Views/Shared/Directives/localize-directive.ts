module app {

    export class LocalizeDirective {
        public static Injection: string = 'localize';
        public static $inject = [
            '$resources'
        ];

        constructor(
            private $resources: ResourceService
        ) {

        }

        public restrict: string = 'A';
        public replace: boolean = false;
        public template: string = '<span>{{text}}</span>';
        public scope: any = {
            resourceName: '@localize'
        };

        public link(scope, elem, attrs) {
            this.$resources.resolve(scope.resourceName, (value) => {
                scope.text = value;
            });
        }
    }

    angular
        .module('app')
        .directive(LocalizeDirective.Injection, Activator.CreateFactory(LocalizeDirective));

}