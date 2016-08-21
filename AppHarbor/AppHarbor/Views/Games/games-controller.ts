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
        ) { }

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
            'game'
        ];

        constructor(public game: any) { }
    }

    export class GamesController {
        static Injection: string = 'gamesController';
        static $inject = [
            '$scope',
            '$rootScope',
            GamesRepository.Injection,
            AccountRepository.Injection,
            '$uibModal',
            '$timeout',
            GeneralHubService.Injection,
            ActiveGameHubService.Injection
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
            private repository: GamesRepository,
            private userRepository: AccountRepository,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private $timeout: ng.ITimeoutService,
            private generalHub: GeneralHubService
        ) {
            this.bindGames(true);

            generalHub.$on(GeneralHubService.$events.RefreshGameList, () => {
                this.bindGames(false);
            });

        }

        public createGame() {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-create.html',
                controllerAs: 'vm',
                controller: CreateGameController,
                resolve: { game: () => { return this.repository.create(); } }
            });

            modal.result.then((game) => {
                game.$save().then(() => { this.bindGames(true); });
            });
        }

        public showDetails(game) {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-details.html',
                controllerAs: 'vm',
                controller: GameDetailsController,
                resolve: { game: () => { return game; } }
            });

            modal.result.then(() => {
                this.bindGames(true);
                this.view = 'MyGames';
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