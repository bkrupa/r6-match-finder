module app {



    export class GameDetailsController {
        static Injection: string = 'gameDetailsController';
        static $inject = ['game']

        constructor(public game: any) { }
    }

    export class CreateGameController {
        static Injection: string = 'createGameController';
        static $inject = [
            'game'
        ];

        public minDate = new Date();
        public hourStep = 1;
        public dateOptions = {
            startingDay: 1,
            showWeeks: false
        };

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
            'Hub'
        ];

        private games: Array<any> = [];
        private myGames: Array<any> = [];
        private myStatistics: any = {};
        public pageSize: number = 10;
        public currentPage: number = 1;
        public view: string = '';

        private generalHub: any;

        private options: ngSignalr.HubOptions = {
            listeners: {
                refreshGamesList: () => {
                    this.bindGames();
                }
            },
            errorHandler: this.onSignalRError,
            stateChanged: function (state) {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.connected:
                        //your code here
                        break;
                    case $.signalR.connectionState.reconnecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.disconnected:
                        //your code here
                        break;
                }
            }
        };

        private onSignalRError(error) {
            console.error(error);
        }

        constructor(
            private $scope: ng.IScope,
            private $rootScope: IAppRootScope,
            private repository: GamesRepository,
            private userRepository: AccountRepository,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private Hub: ngSignalr.HubFactory
        ) {
            this.generalHub = new Hub('generalHub', this.options);
            this.bindGames();
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
                game.$save().then(() => { this.bindGames(); });
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
                this.bindGames();
            });
        }

        public completeGame(game) {

        }

        public bindGames() {
            if (this.games.$resolved !== false)
                this.games = this.repository.getAll();
            if (this.myGames.$resolved !== false)
                this.myGames = this.repository.getMyGames();



            if (this.myStatistics.$resolved !== false)
                this.$rootScope.userInfo.$promise.then((userInfo) => {
                    this.myStatistics = this.userRepository.getUserStatistics(userInfo.id);
                });


            console.log(this.$rootScope.userInfo);
        }

        public deleteGame(game: any) {
            game.$delete().then(() => { this.bindGames(); });
        }


    }

    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);

}