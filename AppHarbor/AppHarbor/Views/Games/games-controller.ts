module app {
    export class CreateGameController {
        static Injection: string = 'createGameController';
        static $inject = [
            GamesRepository.Injection
        ];

        public game: any;

        constructor(
            private repository: GamesRepository
        ) {
            this.game = repository.create();
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
                controller: CreateGameController
            });

            modal.result.then((game) => {
                game.$save().then(() => {
                    this.bindGames();
                });
            });
        }

        public bindGames() {
            this.games = this.repository.getAll();
        }


    }

    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);

}