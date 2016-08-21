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
    }


    angular
        .module('app')
        .factory(ErrorInterceptor.Injection, Activator.CreateFactory(ErrorInterceptor))
        .config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
            $httpProvider.interceptors.push(Activator.CreateFactory(ErrorInterceptor));
        }]);

}