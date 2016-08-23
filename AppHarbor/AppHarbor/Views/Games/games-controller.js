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
        function CreateGameController(game, maps) {
            this.game = game;
            this.maps = maps;
            game.mapId = maps[0].id;
        }
        CreateGameController.Injection = 'createGameController';
        CreateGameController.$inject = [
            'game',
            'maps'
        ];
        return CreateGameController;
    }());
    app.CreateGameController = CreateGameController;
    var GamesController = (function () {
        function GamesController($scope, $rootScope, $state, $stateParams, repository, userRepository, $uibModal, $timeout, generalHub, maps) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.repository = repository;
            this.userRepository = userRepository;
            this.$uibModal = $uibModal;
            this.$timeout = $timeout;
            this.generalHub = generalHub;
            this.maps = maps;
            this.games = [];
            this.myGames = [];
            this.myStatistics = {};
            this.pageSize = 10;
            this.currentPage = 1;
            this.view = '';
            this.bindGames(true);
            $scope.$on('$stateChangeSuccess', function (event, state, params) {
                if (params.gameId) {
                    _this.openDetailsModal(params.gameId, params.group);
                }
            });
            generalHub.$on(app.GeneralHubService.$events.RefreshGameList, function () {
                console.log('refresh!');
                _this.bindGames(false);
            });
        }
        GamesController.prototype.createGame = function () {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-create.html',
                controllerAs: 'vm',
                controller: CreateGameController,
                resolve: {
                    game: function () { return _this.repository.create().$promise; },
                    maps: function () { return _this.maps; }
                }
            });
            modal.result.then(function (game) {
                game.$save().then(function () { _this.bindGames(true); });
            });
        };
        GamesController.prototype.showDetails = function (game) {
            var group = game.isOpen ? 'open' : game.isActive ? 'active' : 'complete';
            this.$state.go(app.RouteConfig.$routes.GameDetails, { gameId: game.id, group: group });
        };
        GamesController.prototype.openDetailsModal = function (gameId, group) {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-details.html',
                controllerAs: 'vm',
                controller: GameDetailsController,
                resolve: {
                    game: function () {
                        switch (group) {
                            case 'open':
                                return _this.repository.getOpenGame(gameId).$promise;
                            case 'active':
                                return _this.repository.getActiveGame(gameId).$promise;
                            case 'complete':
                                return _this.repository.getCompleteGame(gameId).$promise;
                        }
                    }
                }
            });
            modal.result.then(function () {
                _this.bindGames(true);
                _this.view = 'MyGames';
            }).finally(function () {
                _this.$state.go(app.RouteConfig.$routes.Home);
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
            '$state',
            '$stateParams',
            app.GamesRepository.Injection,
            app.AccountRepository.Injection,
            '$uibModal',
            '$timeout',
            app.GeneralHubService.Injection,
            'Maps'
        ];
        return GamesController;
    }());
    app.GamesController = GamesController;
    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);
})(app || (app = {}));
