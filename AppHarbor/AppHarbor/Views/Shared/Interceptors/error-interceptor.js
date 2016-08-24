var app;
(function (app) {
    var ErrorInterceptor = (function () {
        function ErrorInterceptor($q) {
            this.$q = $q;
        }
        ErrorInterceptor.prototype.responseError = function (response) {
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
        };
        ErrorInterceptor.Injection = 'errorInterceptor';
        ErrorInterceptor.$inject = [
            '$q'
        ];
        return ErrorInterceptor;
    }());
    app.ErrorInterceptor = ErrorInterceptor;
    angular
        .module('app')
        .factory(ErrorInterceptor.Injection, app.Activator.CreateFactory(ErrorInterceptor))
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(app.Activator.CreateFactory(ErrorInterceptor));
        }]);
})(app || (app = {}));
//# sourceMappingURL=error-interceptor.js.map