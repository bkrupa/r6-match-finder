var app;
(function (app) {
    var CreateGameController = (function () {
        function CreateGameController(game) {
            this.game = game;
        }
        CreateGameController.Injection = 'createGameController';
        CreateGameController.$inject = [
            'game'
        ];
        return CreateGameController;
    }());
    app.CreateGameController = CreateGameController;
    var GamesController = (function () {
        function GamesController(repository, $uibModal) {
            this.repository = repository;
            this.$uibModal = $uibModal;
            this.pageSize = 10;
            this.currentPage = 1;
            this.view = '';
            this.bindGames();
        }
        GamesController.prototype.createGame = function () {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-create.html',
                controllerAs: 'vm',
                controller: CreateGameController,
                resolve: { game: function () { return _this.repository.create(); } }
            });
            modal.result.then(function (game) {
                game.$save().then(function () { _this.bindGames(); });
            });
        };
        GamesController.prototype.bindGames = function () {
            this.games = this.repository.getAll();
        };
        GamesController.prototype.deleteGame = function (game) {
            var _this = this;
            game.$delete().then(function () { _this.bindGames(); });
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
