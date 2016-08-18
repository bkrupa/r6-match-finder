var app;
(function (app) {
    var EnumDropdownDirective = (function () {
        function EnumDropdownDirective($resources, Enums) {
            this.$resources = $resources;
            this.Enums = Enums;
            this.require = '?ngModel';
            this.restrict = 'A';
            this.replace = true;
            this.template = '<select ng-options="value as resolve(key) for (key, value) in options"></select>';
            this.scope = {
                enumName: '@enumDropdown'
            };
        }
        EnumDropdownDirective.prototype.link = function (scope, element, attrs, ngModel) {
            var that = this;
            scope.options = this.Enums[scope.enumName];
            scope.resolve = function (val) {
                return that.$resources.resolve(val, undefined);
            };
        };
        EnumDropdownDirective.factory = function () {
            var directive = function ($resources, Enums) { return new EnumDropdownDirective($resources, Enums); };
            directive.$inject = EnumDropdownDirective.$inject;
            return directive;
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
        .directive(EnumDropdownDirective.Injection, EnumDropdownDirective.factory());
})(app || (app = {}));
