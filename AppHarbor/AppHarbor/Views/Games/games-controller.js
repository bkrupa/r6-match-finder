var app;
(function (app) {
    var GameDetailsController = (function () {
        function GameDetailsController(game) {
            this.game = game;
        }
        GameDetailsController.Injection = 'gameDetailsController';
        GameDetailsController.$inject = ['game'];
        return GameDetailsController;
    }());
    app.GameDetailsController = GameDetailsController;
    var CreateGameController = (function () {
        function CreateGameController(game) {
            this.game = game;
            this.minDate = new Date();
            this.hourStep = 1;
            this.dateOptions = {
                startingDay: 1,
                showWeeks: false
            };
        }
        CreateGameController.Injection = 'createGameController';
        CreateGameController.$inject = [
            'game'
        ];
        return CreateGameController;
    }());
    app.CreateGameController = CreateGameController;
    var GamesController = (function () {
        function GamesController($scope, $rootScope, repository, userRepository, $uibModal, Hub) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.repository = repository;
            this.userRepository = userRepository;
            this.$uibModal = $uibModal;
            this.Hub = Hub;
            this.games = [];
            this.myGames = [];
            this.myStatistics = {};
            this.pageSize = 10;
            this.currentPage = 1;
            this.view = '';
            this.options = {
                listeners: {
                    refreshGamesList: function () {
                        _this.bindGames();
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
            this.generalHub = new Hub('generalHub', this.options);
            this.bindGames();
        }
        GamesController.prototype.onSignalRError = function (error) {
            console.error(error);
        };
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
        GamesController.prototype.showDetails = function (game) {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-details.html',
                controllerAs: 'vm',
                controller: GameDetailsController,
                resolve: { game: function () { return game; } }
            });
            modal.result.then(function () {
                _this.bindGames();
            });
        };
        GamesController.prototype.completeGame = function (game) {
        };
        GamesController.prototype.bindGames = function () {
            var _this = this;
            if (this.games.$resolved !== false)
                this.games = this.repository.getAll();
            if (this.myGames.$resolved !== false)
                this.myGames = this.repository.getMyGames();
            if (this.myStatistics.$resolved !== false)
                this.$rootScope.userInfo.$promise.then(function (userInfo) {
                    _this.myStatistics = _this.userRepository.getUserStatistics(userInfo.id);
                });
            console.log(this.$rootScope.userInfo);
        };
        GamesController.prototype.deleteGame = function (game) {
            var _this = this;
            game.$delete().then(function () { _this.bindGames(); });
        };
        GamesController.Injection = 'gamesController';
        GamesController.$inject = [
            '$scope',
            '$rootScope',
            app.GamesRepository.Injection,
            app.AccountRepository.Injection,
            '$uibModal',
            'Hub'
        ];
        return GamesController;
    }());
    app.GamesController = GamesController;
    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);
})(app || (app = {}));
//# sourceMappingURL=games-controller.js.map