var app;
(function (app) {
    var RadioButtonGroupDirective = (function () {
        function RadioButtonGroupDirective() {
            this.require = 'ngModel';
            this.replace = false;
            this.restrict = 'A';
            this.template = '<div class="btn-group" data-toggle="buttons">' +
                '<button type="button" class="btn btn-primary" ng-if="showNull" ng-class="{active: value == null}" ng-click="setValue(null)">{{nullText}}</button>' +
                '<button type="button" class="btn btn-primary" ng-class="{active: value == i}" ng-click="setValue(i)" ng-repeat="i in getValues()" >{{i}}</button>' +
                '</div>';
            this.scope = {
                count: '=',
                start: '=',
                nullText: '@',
                showNull: '='
            };
        }
        RadioButtonGroupDirective.prototype.link = function (scope, element, attrs, ngModelCtrl) {
            scope.getValues = function () {
                return app.Utilities.Range(scope.count || 0, scope.start);
            };
            scope.setValue = function (newValue) {
                scope.value = newValue;
                ngModelCtrl.$setViewValue(newValue);
            };
            ngModelCtrl.$render = function () {
                scope.value = ngModelCtrl.$viewValue;
            };
        };
        RadioButtonGroupDirective.factory = function () {
            var directive = function () { return new RadioButtonGroupDirective(); };
            directive.$inject = RadioButtonGroupDirective.$inject;
            return directive;
        };
        RadioButtonGroupDirective.Injection = 'radioButtonGroup';
        RadioButtonGroupDirective.$inject = [];
        return RadioButtonGroupDirective;
    }());
    app.RadioButtonGroupDirective = RadioButtonGroupDirective;
    angular
        .module('app')
        .directive(RadioButtonGroupDirective.Injection, RadioButtonGroupDirective.factory());
})(app || (app = {}));
