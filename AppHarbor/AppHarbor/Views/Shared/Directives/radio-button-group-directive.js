var app;
(function (app) {
    var RadioButtonGroupDirective = (function () {
        function RadioButtonGroupDirective() {
            this.require = 'ngModel';
            this.replace = false;
            this.restrict = 'A';
            this.template = '<div class="btn-group" data-toggle="buttons">' +
                '<button type="button" class="btn btn-secondary btn-sm" ng-if="showNull" ng-class="{active: value == null}" ng-click="setValue(null)">{{nullText}}</button>' +
                '<button type="button" class="btn btn-secondary btn-sm" ng-class="{active: value == i}" ng-click="setValue(i)" ng-repeat="i in getValues()" >{{i}}</button>' +
                '</div>';
            this.scope = {
                count: '=',
                start: '=',
                nullText: '@',
                showNull: '=',
                step: '='
            };
        }
        RadioButtonGroupDirective.prototype.link = function (scope, element, attrs, ngModelCtrl) {
            scope.getValues = function () {
                return app.Utilities.Range(scope.count || 0, scope.start || 0, scope.step || 1);
            };
            scope.setValue = function (newValue) {
                scope.value = newValue;
                ngModelCtrl.$setViewValue(newValue);
            };
            ngModelCtrl.$render = function () {
                scope.value = ngModelCtrl.$viewValue;
            };
        };
        RadioButtonGroupDirective.Injection = 'radioButtonGroup';
        RadioButtonGroupDirective.$inject = [];
        return RadioButtonGroupDirective;
    }());
    app.RadioButtonGroupDirective = RadioButtonGroupDirective;
    angular
        .module('app')
        .directive(RadioButtonGroupDirective.Injection, app.Activator.CreateFactory(RadioButtonGroupDirective));
})(app || (app = {}));
