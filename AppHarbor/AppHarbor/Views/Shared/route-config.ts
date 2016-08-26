module app {

    export interface Routes {
        Home: string;
        GameDetails: string;
        Tour: string;
        Admin: string;
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
            Tour: 'tour',
            Admin: 'admin',
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
                .state(RouteConfig.$routes.Tour, {
                    url: '/tour',
                    templateUrl: 'Views/Games/games-landing.html',
                    controller: TourController.Injection,
                    controllerAs: 'vm',
                    resolve: {
                        Maps: [MapsRepository.Injection, (repo: MapsRepository) => { return repo.getAll().$promise; }],
                        Game: [GamesRepository.Injection, (repo: GamesRepository) => { return repo.create().$promise; }]
                    }
                })

                .state(RouteConfig.$routes.Admin, {
                    url: '/admin',
                    templateUrl: 'Views/Admin/admin.html',
                    controller: AdminController.Injection,
                    controllerAs: 'vm'
                })

                .state(RouteConfig.$routes.Home, {
                    url: '/games',
                    templateUrl: 'Views/Games/games-landing.html',
                    controller: GamesController.Injection,
                    controllerAs: 'vm',
                    resolve: {
                        userInfo: ['$rootScope', ($rootScope) => $rootScope.userInfo.$promise]
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