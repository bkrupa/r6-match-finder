module app {

    export class RouteConfig {
        static $inject = [
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider'
        ];

        constructor(
            private $stateProvider: ng.ui.IStateProvider,
            private $urlRouterProvider: ng.ui.IUrlRouterProvider,
            private $locationProvider: ng.ILocationProvider
        ) {
            $urlRouterProvider.rule(($injector, $location) => {
                //what this function returns will be set as the $location.url
                var path = $location.path(), normalized = path.toLowerCase();

                if (path != normalized) {
                    //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
                    $location.replace().path(normalized);
                }
                // because we've returned nothing, no state change occurs
            });


            $stateProvider
                .state('home', { url: '/games', templateUrl: 'Views/Games/games-grid.html', controller: GamesController.Injection, controllerAs: 'vm' })
                ;


            //.otherwise({ redirectTo: function () { return redirectFn.apply(this, arguments) || '/'; } });
            $urlRouterProvider.otherwise('/games');

            $locationProvider.html5Mode(true);

        }
    }

    angular
        .module('app')
        .config(RouteConfig);
}