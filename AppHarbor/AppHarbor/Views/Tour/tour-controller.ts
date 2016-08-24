module app {
    export class TourController {
        static Injection: string = 'tourController';
        static $inject = ['$scope', '$uibModal', 'Game', 'Maps', GamesRepository.Injection, GameModalService.Injection];

        private games: Array<any> = [];
        private myGames: Array<any> = [];

        constructor(
            private $scope: ng.IScope,
            private $uibModal: ng.ui.bootstrap.IModalService,
            private Game: IGameResource,
            private Maps: ng.resource.IResourceArray<any>,
            private repository: GamesRepository,
            private $modal: GameModalService
        ) {
            var demoGame = angular.copy(Game);
            demoGame.id = 'demo';
            demoGame.map = Maps[0];
            this.games.push(demoGame);

            var secondGame = angular.copy(Game);
            secondGame.userId = '';
            secondGame.map = Maps[1];
            this.games.push(secondGame);

            var thirdGame = angular.copy(Game);
            thirdGame.userId = '';
            thirdGame.map = Maps[2];
            this.games.push(thirdGame);


            var active1 = angular.copy(Game);
            active1.isActive = true;
            active1.map = Maps[3];
            this.myGames.push(active1);

            var completed = angular.copy(Game);
            completed.isComplete = true;
            completed.map = Maps[4];
            this.myGames.push(completed);


            var active2 = angular.copy(Game);
            active2.isActive = true;
            active2.map = Maps[4];
            this.myGames.push(active2);

            this.games.$resolved = true;
            this.myGames.$resolved = true;
        }

        public showDetails(game) {
            this.$modal.openDetailsModal(game, false, true);
        }
    }

    angular
        .module('app')
        .controller(TourController.Injection, TourController);
}