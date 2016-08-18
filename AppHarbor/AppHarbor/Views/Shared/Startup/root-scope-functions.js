var app;
(function (app) {
    var RootScopeFunctionsConfig = (function () {
        function RootScopeFunctionsConfig($rootScope, resourceService) {
            $rootScope.resolve = function (value) {
                return resourceService.resolve(value, undefined);
            };
            $rootScope.range = function (count, start) {
                return app.Utilities.Range(count, start);
            };
        }
        RootScopeFunctionsConfig.$inject = [
            '$rootScope',
            app.ResourceService.Injection
        ];
        return RootScopeFunctionsConfig;
    }());
    app.RootScopeFunctionsConfig = RootScopeFunctionsConfig;
    angular
        .module('app')
        .run(RootScopeFunctionsConfig);
})(app || (app = {}));
