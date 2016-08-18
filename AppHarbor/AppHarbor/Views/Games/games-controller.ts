module app {

    export class CreateGameController {
        static Injection: string = 'createGameController';
        static $inject = [
            'game'
        ];

        constructor(
            public game: any
        ) {
        }
    }

    export class GamesController {
        static Injection: string = 'gamesController';
        static $inject = [
            GamesRepository.Injection,
            '$uibModal'
        ];

        private games: Array<any>;
        public pageSize: number = 10;
        public currentPage: number = 1;
        public view: string = '';



        constructor(
            private repository: GamesRepository,
            private $uibModal: ng.ui.bootstrap.IModalService
        ) {

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

        public bindGames() {
            this.games = this.repository.getAll();
        }

        public deleteGame(game: any) {
            game.$delete().then(() => { this.bindGames(); });
        }


    }

    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);

}