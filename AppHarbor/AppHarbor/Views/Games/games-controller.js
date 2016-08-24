var app;
(function (app) {
    var GamesController = (function () {
        function GamesController($scope, $rootScope, $state, $stateParams, repository, userRepository, $modal, $timeout, generalHub) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.repository = repository;
            this.userRepository = userRepository;
            this.$modal = $modal;
            this.$timeout = $timeout;
            this.generalHub = generalHub;
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
        GamesController.prototype.openChat = function (game) {
            this.$rootScope.$emit('openGameChat', game.id);
        };
        GamesController.prototype.createGame = function () {
            var _this = this;
            this.$modal.showCreateModal().result.then(function (game) {
                game.$save().then(function () { _this.bindGames(true); });
            });
        };
        GamesController.prototype.showDetails = function (game) {
            var group = game.isOpen ? 'open' : game.isActive ? 'active' : 'complete';
            this.$state.go(app.RouteConfig.$routes.GameDetails, { gameId: game.id, group: group });
        };
        GamesController.prototype.openDetailsModal = function (gameId, group) {
            var _this = this;
            this.$modal.openDetailsModal(function () {
                switch (group) {
                    case 'open':
                        return _this.repository.getOpenGame(gameId).$promise;
                    case 'active':
                        return _this.repository.getActiveGame(gameId).$promise;
                    case 'complete':
                        return _this.repository.getCompleteGame(gameId).$promise;
                }
            }).result.then(function () {
                _this.bindGames(true);
                _this.view = 'MyGames';
            }).finally(function () {
                _this.$state.go(app.RouteConfig.$routes.Home);
            });
        };
        GamesController.prototype.completeGame = function (game) {
            var _this = this;
            this.$modal.openCompleteModal(game).result.then(function (rating) {
                _this.bindGames(true);
            });
        };
        GamesController.prototype.rateGame = function (game) {
            var _this = this;
            this.$modal.openRatingModal(game).result.then(function (rating) {
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
            app.GameModalService.Injection,
            '$timeout',
            app.GeneralHubService.Injection
        ];
        return GamesController;
    }());
    app.GamesController = GamesController;
    angular
        .module('app')
        .controller(GamesController.Injection, GamesController);
})(app || (app = {}));
