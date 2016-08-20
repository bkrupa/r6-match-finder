var app;
(function (app) {
    var DateTimePickerDirective = (function () {
        function DateTimePickerDirective($timeout) {
            this.$timeout = $timeout;
            this.restrict = 'A';
            this.require = 'ngModel';
            this.scope = {
                required: '=ngRequired'
            };
            this.templateUrl = '/Views/Shared/Directives/templates/datetimepicker-template.html';
        }
        DateTimePickerDirective.prototype.link = function (scope, element, attrs, ngModelCtrl) {
            var _this = this;
            scope.isShowing = false;
            var start = new Date();
            // Round the start date up to the nearest 15 minutes
            var m = (((start.getMinutes() + 7.5) / 15 | 0) * 15) % 60;
            var h = ((((start.getMinutes() / 105) + .5) | 0) + start.getHours()) % 24;
            start.setHours(h);
            start.setMinutes(m);
            var end = new Date();
            end.setHours(h + 6);
            end.setMinutes(m);
            scope.dateOptions = {
                formatYear: 'yy',
                maxDate: end,
                minDate: start,
                showWeeks: false
            };
            scope.open = function () {
                scope.isShowing = true;
            };
            var value = new Date();
            scope.$watch('date', function (newValue) {
                value.setFullYear(newValue.getFullYear());
                value.setDate(newValue.getDate());
                value.setMonth(newValue.getMonth());
                if (value < start)
                    value.setTime(start.getTime());
                if (value > end)
                    value.setTime(end.getTime());
                _this.BindModels(scope, value);
                ngModelCtrl.$setViewValue(value);
            });
            scope.$watch('time', function (newValue) {
                value.setHours(newValue.getHours());
                value.setMinutes(newValue.getMinutes());
                value.setSeconds(newValue.getSeconds());
                value.setMilliseconds(newValue.getMilliseconds());
                if (value < start)
                    value.setTime(start.getTime());
                if (value > end)
                    value.setTime(end.getTime());
                _this.BindModels(scope, value);
                ngModelCtrl.$setViewValue(value);
            });
            ngModelCtrl.$render = function () {
                value = new Date(ngModelCtrl.$viewValue);
                _this.Initialize(scope, value);
            };
        };
        DateTimePickerDirective.prototype.Initialize = function (scope, value) {
            scope.date = new Date();
            scope.time = new Date(0, 0, 0);
            this.BindModels(scope, value);
        };
        DateTimePickerDirective.prototype.BindModels = function (scope, value) {
            scope.date.setFullYear(value.getFullYear());
            scope.date.setDate(value.getDate());
            scope.date.setMonth(value.getMonth());
            var orig = new Date(scope.time.getTime());
            scope.time.setHours(value.getHours());
            scope.time.setMinutes(value.getMinutes());
            scope.time.setSeconds(value.getSeconds());
            scope.time.setMilliseconds(value.getMilliseconds());
            if (scope.time.getTime() - orig.getTime() != 0) {
                scope.time = new Date(0, 0, 0, value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
            }
        };
        DateTimePickerDirective.factory = function () {
            var directive = function ($timeout) { return new DateTimePickerDirective($timeout); };
            directive.$inject = DateTimePickerDirective.$inject;
            return directive;
        };
        DateTimePickerDirective.Injection = 'datetimepicker';
        DateTimePickerDirective.$inject = ['$timeout'];
        return DateTimePickerDirective;
    }());
    app.DateTimePickerDirective = DateTimePickerDirective;
    angular.module('app')
        .directive(DateTimePickerDirective.Injection, DateTimePickerDirective.factory());
})(app || (app = {}));
//# sourceMappingURL=datetimepicker-directive.js.map