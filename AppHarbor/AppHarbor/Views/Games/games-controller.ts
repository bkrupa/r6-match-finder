module app {

    export class GameRateController {
        static Injection: string = 'gameRateController';
        static $inject = ['$scope', 'game']

        private rating: number = 5;

        constructor(
            private $scope: ng.ui.bootstrap.IModalScope,
            private game: any
        ) { }

        public RateGame() {
            this.game.$rate(this.rating).$promise.finally(() => {
                this.$scope.$close();
            });
        }
    }

    export class GameCompleteController {
        static Injection: string = 'gameCompleteController';
        static $inject = ['$scope', 'game']

        private rating: number = 5;

        constructor(
            private $scope: ng.ui.bootstrap.IModalScope,
            private game: any
        ) { }

        public RateGame() {
            this.game.$complete(this.rating).$promise.finally(() => {
                this.$scope.$close();
            });
        }
    }

    export class GameDetailsController {
        static Injection: string = 'gameDetailsController';
        static $inject = ['$scope', 'game']

        constructor(
            private $scope: ng.ui.bootstrap.IModalScope,
            private game: any
        ) {
        }

        public JoinGame() {
            this.game.$join().$promise.then(() => {
                this.$scope.$close();
            }, () => {
                this.$scope.$dismiss();
            });
        }
    }

    export class CreateGameController {
        static Injection: string = 'createGameController';
        static $inject = [
            'game',
            'maps'
        ];

        constructor(public game: any,
            public maps: ng.resource.IResourceArray<any>) {
            game.mapId = maps[0].id;
        }
    }

    export class GamesController {
        static Injection: string = 'gamesController';
        static $inject = [
            '$scope',
            '$rootScope',
            '$state',
            '$stateParams',
            GamesRepository.Injection,
            AccountRepository.Injection,
            '$uibModal',
            '$timeout',
            GeneralHubService.Injection,
            'Maps'
        ];

        private games: Array<any> = [];
        private myGames: Array<any> = [];
        private myStatistics: any = {};
        public pageSize: number = 10;
        public currentPage: number = 1;
        public view: string = '';
        private bindTimeout: ng.IPromise<void>;

        constructor(
            private $scope: ng.IScope,
            private $rootScope: IAppRootScope,
            private $state: ng.ui.IStateService,
            private $stateParams: ng.ui.IStateParamsService,
            private repository: GamesRepository,
            private userRepository: AccountRepository,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private $timeout: ng.ITimeoutService,
            private generalHub: GeneralHubService,
            private maps: ng.resource.IResourceArray<any>
        ) {
            this.bindGames(true);

            $scope.$on('$stateChangeSuccess', (event: ng.IAngularEvent, state: ng.ui.IState, params: any) => {
                if (params.gameId) {
                    this.openDetailsModal(params.gameId, params.group);
                }
            });

            generalHub.$on(GeneralHubService.$events.RefreshGameList, () => {
                console.log('refresh!');
                this.bindGames(false);
            });

        }

        public openChat(game) {
            this.$rootScope.$emit('openGameChat', game.id);
        }

        public createGame() {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-create.html',
                controllerAs: 'vm',
                controller: CreateGameController,
                resolve: {
                    game: () => { return this.repository.create().$promise; },
                    maps: () => { return this.maps; }
                }
            });

            modal.result.then((game) => {
                game.$save().then(() => { this.bindGames(true); });
            });
        }

        public showDetails(game) {
            var group = game.isOpen ? 'open' : game.isActive ? 'active' : 'complete';
            this.$state.go(RouteConfig.$routes.GameDetails, { gameId: game.id, group: group });
        }

        private openDetailsModal(gameId: string, group: string) {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-details.html',
                controllerAs: 'vm',
                controller: GameDetailsController,
                resolve: {
                    game: () => {
                        switch (group) {
                            case 'open':
                                return this.repository.getOpenGame(gameId).$promise;
                            case 'active':
                                return this.repository.getActiveGame(gameId).$promise;
                            case 'complete':
                                return this.repository.getCompleteGame(gameId).$promise;
                        }
                    }
                }
            });

            modal.result.then(() => {
                this.bindGames(true);
                this.view = 'MyGames';
            }).finally(() => {
                this.$state.go(RouteConfig.$routes.Home);
            });
        }

        public completeGame(game) {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameCompleteController,
                resolve: { game: () => { return game; } }
            });

            modal.result.then((rating) => {
                this.bindGames(true);
            });
        }

        public rateGame(game) {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameRateController,
                resolve: { game: () => { return game; } }
            });

            modal.result.then((rating) => {
                this.bindGames(true);
            });
        }

        public bindGames(immediate: boolean) {
            this.$timeout.cancel(this.bindTimeout);

            this.bindTimeout = this.$timeout(() => {
                if (this.games.$resolved !== false)
                    this.games = this.repository.getAll();
                if (this.myGames.$resolved !== false)
                    this.myGames = this.repository.getMyGames();

                if (this.myStatistics.$resolved !== false)
                    this.$rootScope.userInfo.$promise.then((userInfo) => {
                        this.myStatistics = this.userRepository.getUserStatistics(userInfo.id);
                    });
            }, immediate ? 0 : 500, true);
        }

        public deleteGame(game: any) {
            game.$delete().then(() => { this.bindGames(true); });
        }
    }

    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);

}