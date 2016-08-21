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
        static $inject = ['$timeout'];

        public restrict: string = 'A';
        public require: string = 'ngModel';
        public scope: any = {
            required: '=ngRequired'
        };

        public constructor(private $timeout: ng.ITimeoutService) { }

        public templateUrl: string = '/Views/Shared/Directives/templates/datetimepicker-template.html';

        public link(scope: DateTimePickerDirectiveScope, element, attrs, ngModelCtrl: ng.INgModelController) {
            scope.isShowing = false;

            var start: Date = new Date();
            // Round the start date up to the nearest 15 minutes
            var m: number = (((start.getMinutes() + 7.5) / 15 | 0) * 15) % 60;
            var h: number = ((((start.getMinutes() / 105) + .5) | 0) + start.getHours()) % 24;
            start.setHours(h);
            start.setMinutes(m);

            var end: Date = new Date();
            end.setHours(h + 6);
            end.setMinutes(m);

            scope.dateOptions = {
                formatYear: 'yy',
                maxDate: end,
                minDate: start,
                showWeeks: false
            };

            scope.open = () => {
                scope.isShowing = true;
            };

            var value: Date = new Date();

            scope.$watch('date', (newValue: Date) => {
                value.setFullYear(newValue.getFullYear());
                value.setDate(newValue.getDate());
                value.setMonth(newValue.getMonth());

                if (value < start)
                    value.setTime(start.getTime());

                if (value > end)
                    value.setTime(end.getTime());

                this.BindModels(scope, value);

                ngModelCtrl.$setViewValue(value);
            });

            scope.$watch('time', (newValue: Date) => {
                value.setHours(newValue.getHours());
                value.setMinutes(newValue.getMinutes());
                value.setSeconds(newValue.getSeconds());
                value.setMilliseconds(newValue.getMilliseconds());

                if (value < start)
                    value.setTime(start.getTime());

                if (value > end)
                    value.setTime(end.getTime());


                this.BindModels(scope, value);

                ngModelCtrl.$setViewValue(value);
            });

            ngModelCtrl.$render = () => {
                value = new Date(ngModelCtrl.$viewValue);
                this.Initialize(scope, value);
            };

        }

        private Initialize(scope: DateTimePickerDirectiveScope, value: Date) {
            scope.date = new Date();
            scope.time = new Date(0, 0, 0);
            this.BindModels(scope, value);
        }

        private BindModels(scope: DateTimePickerDirectiveScope, value: Date) {
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
        }
    }

    angular.module('app')
        .directive(DateTimePickerDirective.Injection, Activator.CreateFactory(DateTimePickerDirective));

}