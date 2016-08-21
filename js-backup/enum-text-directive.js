var app;
(function (app) {
    var EnumTextDirective = (function () {
        function EnumTextDirective($resources, Enums) {
            this.$resources = $resources;
            this.Enums = Enums;
            this.restrict = 'A';
            this.replace = true;
            this.template = '<span>{{text}}</span>';
            this.scope = {
                enumName: '@enumText',
                value: '=value'
            };
        }
        EnumTextDirective.prototype.link = function (scope, elem, attrs) {
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
                        });
                        return;
                    }
                scope.text = "";
            });
        };
        EnumTextDirective.factory = function () {
            var directive = function ($resources, Enums) { return new EnumTextDirective($resources, Enums); };
            directive.$inject = EnumTextDirective.$inject;
            return directive;
        };
        EnumTextDirective.Injection = 'enumText';
        EnumTextDirective.$inject = [
            '$resources',
            'Enums'
        ];
        return EnumTextDirective;
    }());
    app.EnumTextDirective = EnumTextDirective;
    angular
        .module('app')
        .directive(EnumTextDirective.Injection, EnumTextDirective.factory());
})(app || (app = {}));
