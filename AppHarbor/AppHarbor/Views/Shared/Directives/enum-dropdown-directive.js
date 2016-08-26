var app;
(function (app) {
    var EnumDropdownDirective = (function () {
        function EnumDropdownDirective($resources, Enums) {
            this.$resources = $resources;
            this.Enums = Enums;
            this.require = '?ngModel';
            this.restrict = 'A';
            this.replace = true;
            this.template = '<select ng-options="value as resolve(key) for (key, value) in options" ng-change="change()"></select>';
            this.scope = {
                enumName: '@enumDropdown',
                onChange: '&'
            };
        }
        EnumDropdownDirective.prototype.link = function (scope, element, attrs, ngModel) {
            var that = this;
            scope.options = this.Enums[scope.enumName];
            scope.resolve = function (val) {
                return that.$resources.resolve(val, undefined);
            };
            scope.change = function () {
                scope.onChange();
            };
        };
        EnumDropdownDirective.Injection = 'enumDropdown';
        EnumDropdownDirective.$inject = [
            app.ResourceService.Injection,
            'Enums'
        ];
        return EnumDropdownDirective;
    }());
    app.EnumDropdownDirective = EnumDropdownDirective;
    angular
        .module('app')
        .directive(EnumDropdownDirective.Injection, app.Activator.CreateFactory(EnumDropdownDirective));
})(app || (app = {}));
//# sourceMappingURL=enum-dropdown-directive.js.map