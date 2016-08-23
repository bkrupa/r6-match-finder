module app {

    export interface Routes {
        Home: string;
        GameDetails: string;
        Contact: string;
    }

    export class RouteConfig {
        static $inject = [
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider'
        ];

        static $routes: Routes = {
            Home: 'home',
            GameDetails: 'home.details',
            Contact: 'contact'
        };

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
                .state(RouteConfig.$routes.Contact, {
                    url: '/contact',
                    templateUrl: 'Views/Contact/contact.html'
                })
                .state(RouteConfig.$routes.Home, {
                    url: '/games',
                    templateUrl: 'Views/Games/games-landing.html',
                    controller: GamesController.Injection,
                    controllerAs: 'vm',
                    resolve: {
                        Maps: [MapsRepository.Injection, (repo: MapsRepository) => { return repo.getAll(); }]
                    }
                })

                .state(RouteConfig.$routes.GameDetails, { url: '/:group/:gameId', params: { group: 'open' } })
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