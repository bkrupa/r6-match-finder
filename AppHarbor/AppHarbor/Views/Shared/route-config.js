var app;
(function (app) {
    var RouteConfig = (function () {
        function RouteConfig($stateProvider, $urlRouterProvider, $locationProvider) {
            this.$stateProvider = $stateProvider;
            this.$urlRouterProvider = $urlRouterProvider;
            this.$locationProvider = $locationProvider;
            $urlRouterProvider.rule(function ($injector, $location) {
                //what this function returns will be set as the $location.url
                var path = $location.path(), normalized = path.toLowerCase();
                if (path != normalized) {
                    //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
                    $location.replace().path(normalized);
                }
                // because we've returned nothing, no state change occurs
            });
            $stateProvider
                .state('home', { url: '/games', templateUrl: 'Views/Games/games-landing.html', controller: app.GamesController.Injection, controllerAs: 'vm' });
            //.otherwise({ redirectTo: function () { return redirectFn.apply(this, arguments) || '/'; } });
            $urlRouterProvider.otherwise('/games');
            $locationProvider.html5Mode(true);
        }
        RouteConfig.$inject = [
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider'
        ];
        return RouteConfig;
    }());
    app.RouteConfig = RouteConfig;
    angular
        .module('app')
        .config(RouteConfig);
})(app || (app = {}));
//# sourceMappingURL=route-config.js.map