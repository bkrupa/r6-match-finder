var app;
(function (app) {
    var GameRateController = (function () {
        function GameRateController($scope, game) {
            this.$scope = $scope;
            this.game = game;
            this.rating = 5;
        }
        GameRateController.prototype.RateGame = function () {
            var _this = this;
            this.game.$rate(this.rating).$promise.finally(function () {
                _this.$scope.$close();
            });
        };
        GameRateController.Injection = 'gameRateController';
        GameRateController.$inject = ['$scope', 'game'];
        return GameRateController;
    }());
    app.GameRateController = GameRateController;
    var GameCompleteController = (function () {
        function GameCompleteController($scope, game) {
            this.$scope = $scope;
            this.game = game;
            this.rating = 5;
        }
        GameCompleteController.prototype.RateGame = function () {
            var _this = this;
            this.game.$complete(this.rating).$promise.finally(function () {
                _this.$scope.$close();
            });
        };
        GameCompleteController.Injection = 'gameCompleteController';
        GameCompleteController.$inject = ['$scope', 'game'];
        return GameCompleteController;
    }());
    app.GameCompleteController = GameCompleteController;
    var GameDetailsController = (function () {
        function GameDetailsController($scope, game) {
            this.$scope = $scope;
            this.game = game;
        }
        GameDetailsController.prototype.JoinGame = function () {
            var _this = this;
            this.game.$join().$promise.then(function () {
                _this.$scope.$close();
            }, function () {
                _this.$scope.$dismiss();
            });
        };
        GameDetailsController.Injection = 'gameDetailsController';
        GameDetailsController.$inject = ['$scope', 'game'];
        return GameDetailsController;
    }());
    app.GameDetailsController = GameDetailsController;
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
        function GamesController($scope, $rootScope, repository, userRepository, $uibModal, $timeout, generalHub, activeGameHub) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.repository = repository;
            this.userRepository = userRepository;
            this.$uibModal = $uibModal;
            this.$timeout = $timeout;
            this.generalHub = generalHub;
            this.activeGameHub = activeGameHub;
            this.games = [];
            this.myGames = [];
            this.myStatistics = {};
            this.pageSize = 10;
            this.currentPage = 1;
            this.view = '';
            this.bindGames(true);
            generalHub.$on(app.GeneralHubService.$events.RefreshGameList, function () {
                console.log('refresh');
                _this.bindGames(false);
            }).$on(app.GeneralHubService.$events.Test, function (msg) {
                console.log(msg);
            });
            activeGameHub.$on(app.ActiveGameHubService.$events.ReceiveMessage, function (msg) {
                console.log(msg);
            });
        }
        GamesController.prototype.sendChatMessage = function () {
            this.activeGameHub.SendMessage('test').then(function () {
                console.log('success');
            }, function () {
                console.log('error');
            });
        };
        GamesController.prototype.sendRefreshMessage = function () {
            this.generalHub.ForceRefresh().then(function () {
                console.log('success');
            }, function () {
                console.log('error');
            });
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
                game.$save().then(function () { _this.bindGames(true); });
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
                _this.bindGames(true);
                _this.view = 'MyGames';
            });
        };
        GamesController.prototype.completeGame = function (game) {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameCompleteController,
                resolve: { game: function () { return game; } }
            });
            modal.result.then(function (rating) {
                _this.bindGames(true);
            });
        };
        GamesController.prototype.rateGame = function (game) {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameRateController,
                resolve: { game: function () { return game; } }
            });
            modal.result.then(function (rating) {
                _this.bindGames(true);
            });
        };
        GamesController.prototype.bindGames = function (immediate) {
            var _this = this;
            this.$timeout.cancel(this.bindTimeout);
            this.bindTimeout = this.$timeout(function () {
                if (_this.games.$resolved !== false)
                    _this.games = _this.repository.getAll();
                if (_this.myGames.$resolved !== false)
                    _this.myGames = _this.repository.getMyGames();
                if (_this.myStatistics.$resolved !== false)
                    _this.$rootScope.userInfo.$promise.then(function (userInfo) {
                        _this.myStatistics = _this.userRepository.getUserStatistics(userInfo.id);
                    });
            }, immediate ? 0 : 500, true);
        };
        GamesController.prototype.deleteGame = function (game) {
            var _this = this;
            game.$delete().then(function () { _this.bindGames(true); });
        };
        GamesController.Injection = 'gamesController';
        GamesController.$inject = [
            '$scope',
            '$rootScope',
            app.GamesRepository.Injection,
            app.AccountRepository.Injection,
            '$uibModal',
            '$timeout',
            app.GeneralHubService.Injection,
            app.ActiveGameHubService.Injection
        ];
        return GamesController;
    }());
    app.GamesController = GamesController;
    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);
})(app || (app = {}));
