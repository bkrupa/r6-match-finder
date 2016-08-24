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
    var GameModalService = (function () {
        function GameModalService($uibModal, gameRepository, mapRepository) {
            this.$uibModal = $uibModal;
            this.gameRepository = gameRepository;
            this.mapRepository = mapRepository;
        }
        GameModalService.prototype.showCreateModal = function () {
            var _this = this;
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-create.html',
                controllerAs: 'vm',
                controller: CreateGameController,
                resolve: {
                    game: function () { return _this.gameRepository.create().$promise; },
                    maps: function () { return _this.mapRepository.getAll().$promise; }
                }
            });
            return modal;
        };
        GameModalService.prototype.openCompleteModal = function (game) {
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameCompleteController,
                resolve: { game: game }
            });
            return modal;
        };
        GameModalService.prototype.openRatingModal = function (game) {
            var modal = this.$uibModal.open({
                backdrop: 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-rate.html',
                controllerAs: 'vm',
                controller: GameRateController,
                resolve: { game: game }
            });
            return modal;
        };
        GameModalService.prototype.openDetailsModal = function (game, instant, hideBackdrop) {
            var modal = this.$uibModal.open({
                animation: !instant,
                backdrop: !hideBackdrop ? false : 'static',
                size: 'lg',
                templateUrl: '/Views/Games/game-details.html',
                controllerAs: 'vm',
                controller: GameDetailsController,
                resolve: { game: game }
            });
            return modal;
        };
        GameModalService.Injection = 'gameModalService';
        GameModalService.$inject = ['$uibModal', app.GamesRepository.Injection, app.MapsRepository.Injection];
        return GameModalService;
    }());
    app.GameModalService = GameModalService;
    angular
        .module('app')
        .factory(GameModalService.Injection, app.Activator.CreateFactory(GameModalService));
})(app || (app = {}));
