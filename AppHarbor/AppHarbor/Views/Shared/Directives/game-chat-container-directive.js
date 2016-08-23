var app;
(function (app) {
    var GameChatContainerController = (function () {
        function GameChatContainerController($timeout, generalHub, gameHub, gamesRepository) {
            var _this = this;
            this.$timeout = $timeout;
            this.generalHub = generalHub;
            this.gameHub = gameHub;
            this.gamesRepository = gamesRepository;
            this.games = [];
            this.openGames = [];
            generalHub.$on(app.GeneralHubService.$events.RefreshGameList, function () {
                _this.bindGames(false);
            });
            this.bindGames(true);
        }
        GameChatContainerController.prototype.bindGames = function (immediate) {
            var _this = this;
            this.$timeout.cancel(this.bindTimeout);
            this.bindTimeout = this.$timeout(function () {
                if (_this.games.$resolved !== false)
                    _this.games = _this.gamesRepository.getActiveGames();
            }, immediate ? 0 : 500, true);
        };
        GameChatContainerController.prototype.openGameChat = function (game) {
            if (this.openGames.indexOf(game) == -1)
                this.openGames.push(game);
        };
        GameChatContainerController.prototype.close = function (game) {
            var idx = this.openGames.indexOf(game);
            if (idx != -1)
                this.openGames.splice(idx, 1);
        };
        GameChatContainerController.Injection = 'gameChatContainerController';
        GameChatContainerController.$inject = ['$timeout', app.GeneralHubService.Injection, app.ActiveGameHubService.Injection, app.GamesRepository.Injection];
        return GameChatContainerController;
    }());
    var GameChatContainerDirective = (function () {
        function GameChatContainerDirective() {
            this.replace = true;
            this.restrict = 'A';
            this.templateUrl = '/Views/Shared/Directives/templates/game-chat-container-template.html';
            this.scope = {};
            this.controller = GameChatContainerController;
            this.controllerAs = 'vm';
        }
        GameChatContainerDirective.prototype.link = function (scope, element, attrs) {
            this.scrollContainer = element.find('.scroll-container');
            this.scrollContainer.mCustomScrollbar();
        };
        GameChatContainerDirective.Injection = 'gameChatContainer';
        GameChatContainerDirective.$inject = [];
        return GameChatContainerDirective;
    }());
    app.GameChatContainerDirective = GameChatContainerDirective;
    angular
        .module('app')
        .directive(GameChatContainerDirective.Injection, app.Activator.CreateFactory(GameChatContainerDirective));
})(app || (app = {}));
//# sourceMappingURL=game-chat-container-directive.js.map