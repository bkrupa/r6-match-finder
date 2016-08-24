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
                if (response.status == 500)
                    toastr.error(response.data.exceptionMessage);
                else
                    toastr.warning(response.data.exceptionMessage);
                console.error(response.data.exceptionMessage);
            }
            else if (typeof response.data == 'string') {
                if (response.status == 500)
                    toastr.error(response.data);
                else
                    toastr.warning(response.data);
                
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