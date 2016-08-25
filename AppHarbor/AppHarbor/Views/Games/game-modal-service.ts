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

        public actionPhaseTicks: Array<number> = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180,
            190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310,
            320, 330, 340, 350, 360, 390, 420, 450, 480, 510, 540, 570, 600];

        constructor(public game: any,
            public maps: ng.resource.IResourceArray<any>) {
            game.mapId = maps[0].id;
        }
    }

    export class GameModalService {
        static Injection: string = 'gameModalService';
        static $inject = ['$uibModal', GamesRepository.Injection, MapsRepository.Injection];

        constructor(
            private $uibModal: ng.ui.bootstrap.IModalService,
            private gameRepository: GamesRepository,
            private mapRepository: MapsRepository
        ) {
        }

        public showCreateModal() {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-create.html',
                controllerAs: 'vm',
                controller: CreateGameController,
                resolve: {
                    game: () => { return this.gameRepository.create().$promise; },
                    maps: () => { return this.mapRepository.getAll().$promise; }
                }
            });

            return modal;
        }

        public openCompleteModal(game: () => ng.IPromise<any> | Object): ng.ui.bootstrap.IModalServiceInstance {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameCompleteController,
                resolve: { game: game }
            });

            return modal;
        }

        public openRatingModal(game: () => ng.IPromise<any> | Object): ng.ui.bootstrap.IModalServiceInstance {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameRateController,
                resolve: { game: game }
            });

            return modal;
        }

        public openDetailsModal(game: () => ng.IPromise<any> | Object, instant?: boolean, hideBackdrop?: boolean): ng.ui.bootstrap.IModalServiceInstance {
            var modal: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                animation: !instant,
                backdrop: hideBackdrop === false ? false : 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-details.html',
                controllerAs: 'vm',
                controller: GameDetailsController,
                resolve: { game: game }
            });

            return modal;
        }

    }

    angular
        .module('app')
        .factory(GameModalService.Injection, Activator.CreateFactory(GameModalService));
}