var app;
(function (app) {
    var DateTimePickerDirective = (function () {
        function DateTimePickerDirective() {
            this.restrict = 'A';
            this.require = 'ngModel';
            this.scope = {
                required: '=ngRequired'
            };
            this.templateUrl = '/Views/Shared/Directives/templates/datetimepicker-template.html';
        }
        DateTimePickerDirective.prototype.link = function (scope, element, attrs, ngModelCtrl) {
            scope.isShowing = false;
            scope.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date()
            };
            scope.open = function () {
                scope.isShowing = true;
            };
            var value = new Date();
            scope.$watch('date', function (newValue) {
                value.setFullYear(newValue.getFullYear());
                value.setDate(newValue.getDate());
                value.setMonth(newValue.getMonth());
                ngModelCtrl.$setViewValue(value);
            });
            scope.$watch('time', function (newValue) {
                value.setHours(newValue.getHours());
                value.setMinutes(newValue.getMinutes());
                value.setSeconds(newValue.getSeconds());
                value.setMilliseconds(newValue.getMilliseconds());
                ngModelCtrl.$setViewValue(value);
            });
            ngModelCtrl.$render = function () {
                value = new Date(ngModelCtrl.$viewValue);
                scope.date = new Date(value.getFullYear(), value.getMonth(), value.getDate());
                scope.time = new Date(0, 0, 0, value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
            };
        };
        DateTimePickerDirective.factory = function () {
            var directive = function () { return new DateTimePickerDirective(); };
            directive.$inject = DateTimePickerDirective.$inject;
            return directive;
        };
        DateTimePickerDirective.Injection = 'datetimepicker';
        DateTimePickerDirective.$inject = [];
        return DateTimePickerDirective;
    }());
    app.DateTimePickerDirective = DateTimePickerDirective;
    angular.module('app')
        .directive(DateTimePickerDirective.Injection, DateTimePickerDirective.factory());
})(app || (app = {}));
//# sourceMappingURL=datetimepicker-directive.js.map