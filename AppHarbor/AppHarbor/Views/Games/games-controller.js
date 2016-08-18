var app;
(function (app) {
    var CreateGameController = (function () {
        function CreateGameController(repository) {
            this.repository = repository;
            this.game = repository.create();
        }
        CreateGameController.Injection = 'createGameController';
        CreateGameController.$inject = [
            app.GamesRepository.Injection
        ];
        return CreateGameController;
    }());
    app.CreateGameController = CreateGameController;
    var GamesController = (function () {
        function GamesController(repository, $uibModal) {
            this.repository = repository;
            this.$uibModal = $uibModal;
            this.pageSize = 10;
            this.bindGames();
        }
        GamesController.prototype.createGame = function () {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-create.html',
                controllerAs: 'vm',
                controller: CreateGameController
            });
            modal.result.then(function (game) {
                game.$save().then(function () {
                    _this.bindGames();
                });
            });
        };
        GamesController.prototype.bindGames = function () {
            this.games = this.repository.getAll();
        };
        GamesController.Injection = 'gamesController';
        GamesController.$inject = [
            app.GamesRepository.Injection,
            '$uibModal'
        ];
        return GamesController;
    }());
    app.GamesController = GamesController;
    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);
})(app || (app = {}));
//# sourceMappingURL=games-controller.js.map