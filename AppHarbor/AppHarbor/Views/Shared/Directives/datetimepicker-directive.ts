module app {

    interface DateTimePickerDirectiveScope extends ng.IScope {
        date: Date;
        time: Date;
        isShowing: boolean;
        dateOptions: any;
        open: Function;
    }


    export class DateTimePickerDirective implements ng.IDirective {
        static Injection: string = 'datetimepicker';
        static $inject = [];

        public restrict: string = 'A';
        public require: string = 'ngModel';
        public scope: any = {
            required: '=ngRequired'
        };

        public templateUrl: string = '/Views/Shared/Directives/templates/datetimepicker-template.html';

        public link(scope: DateTimePickerDirectiveScope, element, attrs, ngModelCtrl: ng.INgModelController) {
            scope.isShowing = false;

            scope.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date()
            };

            scope.open = () => {
                scope.isShowing = true;
            };

            var value: Date = new Date();

            scope.$watch('date', (newValue: Date) => {
                value.setFullYear(newValue.getFullYear());
                value.setDate(newValue.getDate());
                value.setMonth(newValue.getMonth());


                ngModelCtrl.$setViewValue(value);
            });

            scope.$watch('time', (newValue: Date) => {
                value.setHours(newValue.getHours());
                value.setMinutes(newValue.getMinutes());
                value.setSeconds(newValue.getSeconds());
                value.setMilliseconds(newValue.getMilliseconds());

                ngModelCtrl.$setViewValue(value);
            });

            ngModelCtrl.$render = () => {
                value = new Date(ngModelCtrl.$viewValue);
                scope.date = new Date(value.getFullYear(), value.getMonth(), value.getDate());
                scope.time = new Date(0, 0, 0, value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
            };

        }


        public static factory() {
            var directive = () => new DateTimePickerDirective();
            directive.$inject = DateTimePickerDirective.$inject;
            return directive;
        }
    }

    angular.module('app')
        .directive(DateTimePickerDirective.Injection, DateTimePickerDirective.factory());

}