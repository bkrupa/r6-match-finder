var app;
(function (app) {
    var EnumWhenDirective = (function () {
        function EnumWhenDirective(Enums) {
            this.Enums = Enums;
            this.require = 'ngModel';
            this.restrict = 'A';
            this.transclude = true;
            this.template = '<div ng-if="visible" ng-transclude></div>';
            this.scope = {
                enumWhen: '@'
            };
        }
        EnumWhenDirective.prototype.link = function (scope, elem, attr, ngModel) {
            var values = scope.enumWhen.split('.');
            var value = this.Enums;
            for (var i = 0; value && i < values.length; i++)
                value = value[values[i]];
            scope.visible = false;
            ngModel.$render = function () {
                scope.visible = ngModel.$viewValue == value;
            };
        };
        EnumWhenDirective.Injection = 'enumWhen';
        EnumWhenDirective.$inject = [
            'Enums'
        ];
        return EnumWhenDirective;
    }());
    app.EnumWhenDirective = EnumWhenDirective;
    angular
        .module('app')
        .directive(EnumWhenDirective.Injection, app.Activator.CreateFactory(EnumWhenDirective));
})(app || (app = {}));
//# sourceMappingURL=enum-when-directive.js.map