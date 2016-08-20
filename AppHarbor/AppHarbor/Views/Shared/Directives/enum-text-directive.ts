module app {

    export class EnumTextDirective {
        public static Injection: string = 'enumText';
        public static $inject = [
            '$resources',
            'Enums'
        ];

        constructor(
            private $resources: ResourceService,
            private Enums: any
        ) {

        }

        public restrict: string = 'A';
        public replace: boolean = true;
        public template: string = '<span>{{text}}</span>';
        public scope: any = {
            enumName: '@enumText',
            value: '=value'
        };

        public link(scope, elem, attrs) {
            var array = scope.enumName.split('.');
            var enumObj = this.Enums;
            var that = this;

            for (var i = 0; enumObj && i < array.length; i++)
                enumObj = enumObj[array[i]];

            scope.$watch('value', function (newVal) {
                for (var key in enumObj)
                    if (enumObj[key] == newVal) {

                        that.$resources.resolve(key, function (val) {
                            scope.text = val;
                            console.log(val);
                        });

                        return;
                    }

                scope.text = "";
            });
        }

        public static factory() {
            var directive = ($resources, Enums) => new EnumTextDirective($resources, Enums);
            directive.$inject = EnumTextDirective.$inject;
            return directive;
        }
    }

    angular
        .module('app')
        .directive(EnumTextDirective.Injection, EnumTextDirective.factory());

}