module app {



    export class GamesController {
        static Injection: string = 'gamesController';
        static $inject = [
            '$scope',
            '$rootScope',
            '$state',
            '$stateParams',
            GamesRepository.Injection,
            AccountRepository.Injection,
            GameModalService.Injection,
            '$timeout',
            GeneralHubService.Injection
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
            private $modal: GameModalService,
            private $timeout: ng.ITimeoutService,
            private generalHub: GeneralHubService
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
            this.$modal.showCreateModal().result.then((game) => {
                game.$save().then(() => { this.bindGames(true); });
            });
        }

        public showDetails(game) {
            var group = game.isOpen ? 'open' : game.isActive ? 'active' : 'complete';
            this.$state.go(RouteConfig.$routes.GameDetails, { gameId: game.id, group: group });
        }

        public openDetailsModal(gameId: string, group: string) {
            this.$modal.openDetailsModal(() => {
                switch (group) {
                    case 'open':
                        return this.repository.getOpenGame(gameId).$promise;
                    case 'active':
                        return this.repository.getActiveGame(gameId).$promise;
                    case 'complete':
                        return this.repository.getCompleteGame(gameId).$promise;
                }
            }).result.then(() => {
                this.bindGames(true);
                this.view = 'MyGames';
            }).finally(() => {
                this.$state.go(RouteConfig.$routes.Home);
            });
        }

        public completeGame(game) {
            this.$modal.openCompleteModal(game).result.then((rating) => {
                this.bindGames(true);
            });
        }

        public rateGame(game) {
            this.$modal.openRatingModal(game).result.then((rating) => {
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