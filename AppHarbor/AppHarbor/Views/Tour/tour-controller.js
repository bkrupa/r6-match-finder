var app;
(function (app) {
    var TourController = (function () {
        function TourController($scope, $uibModal, Game, Maps, repository, $modal) {
            this.$scope = $scope;
            this.$uibModal = $uibModal;
            this.Game = Game;
            this.Maps = Maps;
            this.repository = repository;
            this.$modal = $modal;
            this.games = [];
            this.myGames = [];
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
        TourController.prototype.showDetails = function (game) {
            this.$modal.openDetailsModal(game, false, true);
        };
        TourController.Injection = 'tourController';
        TourController.$inject = ['$scope', '$uibModal', 'Game', 'Maps', app.GamesRepository.Injection, app.GameModalService.Injection];
        return TourController;
    }());
    app.TourController = TourController;
    angular
        .module('app')
        .controller(TourController.Injection, TourController);
})(app || (app = {}));
//# sourceMappingURL=tour-controller.js.map