var app;
(function (app) {
    var ErrorInterceptor = (function () {
        function ErrorInterceptor($q) {
            this.$q = $q;
        }
        ErrorInterceptor.prototype.responseError = function (response) {
            if (response.data.exceptionMessage) {
                toastr.error(response.data.exceptionMessage);
                console.error(response.data.exceptionMessage);
            }
            else if (typeof response.data == 'string') {
                toastr.error(response.data);
                console.error(response.data);
            }
            return this.$q.reject(response);
        };
        ErrorInterceptor.factory = function () {
            var interceptor = function ($q) { return new ErrorInterceptor($q); };
            interceptor.$inject = ErrorInterceptor.$inject;
            return interceptor;
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
        .factory(ErrorInterceptor.Injection, ErrorInterceptor.factory())
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(ErrorInterceptor.factory());
        }]);
})(app || (app = {}));
