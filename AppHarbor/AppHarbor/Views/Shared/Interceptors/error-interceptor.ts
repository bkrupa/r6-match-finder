module app {

    export class ErrorInterceptor {
        public static Injection: string = 'errorInterceptor';
        public static $inject = [
            '$q'
        ];

        public constructor(
            private $q: ng.IQService
        ) {

        }

        public responseError(response) {
            if (response.data.exceptionMessage) {
                toastr.error(response.data.exceptionMessage);
                console.error(response.data.exceptionMessage);
            }
            else if (typeof response.data == 'string') {
                toastr.error(response.data);
                console.error(response.data);
            }
            return this.$q.reject(response);

        }

        public static factory() {
            var interceptor = ($q: ng.IQService) => new ErrorInterceptor($q);
            interceptor.$inject = ErrorInterceptor.$inject;
            return interceptor;
        }
    }


    angular
        .module('app')
        .factory(ErrorInterceptor.Injection, ErrorInterceptor.factory())
        .config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
            $httpProvider.interceptors.push(ErrorInterceptor.factory());
        }]);

}