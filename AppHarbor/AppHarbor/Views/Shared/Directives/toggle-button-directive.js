var app;
(function (app) {
    var ToggleButtonDirective = (function () {
        function ToggleButtonDirective($resources) {
            this.$resources = $resources;
            this.require = 'ngModel';
            this.replace = false;
            this.restrict = 'A';
            this.template = '<div class="btn-group" data-toggle="buttons">' +
                '<button type="button" class="btn btn-secondary btn-sm" ng-class="{active: !value}" ng-click="setValue(false)">{{falseText}}</button>' +
                '<button type="button" class="btn btn-secondary btn-sm" ng-class="{active: value}" ng-click="setValue(true)" >{{trueText}}</button>' +
                '</div>';
            this.scope = {
                trueText: '@',
                falseText: '@'
            };
        }
        ToggleButtonDirective.prototype.link = function (scope, element, attrs, ngModelCtrl) {
            if (!scope.falseText) {
                this.$resources.load('NO').then(function (result) {
                    scope.falseText = result;
                });
            }
            if (!scope.trueText) {
                this.$resources.load('YES').then(function (result) {
                    scope.trueText = result;
                });
            }
            scope.setValue = function (newValue) {
                scope.value = newValue;
                ngModelCtrl.$setViewValue(newValue);
            };
            ngModelCtrl.$render = function () {
                scope.value = ngModelCtrl.$viewValue || false;
            };
        };
        ToggleButtonDirective.Injection = 'toggleButton';
        ToggleButtonDirective.$inject = [
            app.ResourceService.Injection
        ];
        return ToggleButtonDirective;
    }());
    app.ToggleButtonDirective = ToggleButtonDirective;
    angular
        .module('app')
        .directive(ToggleButtonDirective.Injection, app.Activator.CreateFactory(ToggleButtonDirective));
})(app || (app = {}));
