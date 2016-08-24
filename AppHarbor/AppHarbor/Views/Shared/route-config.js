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
                .state(RouteConfig.$routes.Contact, {
                url: '/contact',
                templateUrl: 'Views/Contact/contact.html'
            })
                .state(RouteConfig.$routes.Tour, {
                url: '/tour',
                templateUrl: 'Views/Games/games-landing.html',
                controller: app.TourController.Injection,
                controllerAs: 'vm',
                resolve: {
                    Maps: [app.MapsRepository.Injection, function (repo) { return repo.getAll().$promise; }],
                    Game: [app.GamesRepository.Injection, function (repo) { return repo.create().$promise; }]
                }
            })
                .state(RouteConfig.$routes.Home, {
                url: '/games',
                templateUrl: 'Views/Games/games-landing.html',
                controller: app.GamesController.Injection,
                controllerAs: 'vm',
                resolve: {
                    userInfo: ['$rootScope', function ($rootScope) { return $rootScope.userInfo.$promise; }]
                }
            })
                .state(RouteConfig.$routes.GameDetails, { url: '/:group/:gameId', params: { group: 'open' } });
            //.otherwise({ redirectTo: function () { return redirectFn.apply(this, arguments) || '/'; } });
            $urlRouterProvider.otherwise('/games');
            $locationProvider.html5Mode(true);
        }
        RouteConfig.$inject = [
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider'
        ];
        RouteConfig.$routes = {
            Home: 'home',
            GameDetails: 'home.details',
            Contact: 'contact',
            Tour: 'tour'
        };
        return RouteConfig;
    }());
    app.RouteConfig = RouteConfig;
    angular
        .module('app')
        .config(RouteConfig);
})(app || (app = {}));
//# sourceMappingURL=route-config.js.map