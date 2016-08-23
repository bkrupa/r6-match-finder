module app {

    class GameChatContainerController {
        static Injection: string = 'gameChatContainerController'
        static $inject = ['$rootScope', '$timeout', GeneralHubService.Injection, ActiveGameHubService.Injection, GamesRepository.Injection];

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $timeout: ng.ITimeoutService,
            private generalHub: GeneralHubService,
            private gameHub: ActiveGameHubService,
            private gamesRepository: GamesRepository
        ) {
            generalHub.$on(GeneralHubService.$events.RefreshGameList, () => {
                this.bindGames(false);
            });

            $rootScope.$on('openGameChat', (event: ng.IAngularEvent, gameId: string) => {
                var myGames = this.games.filter((g) => g.id == gameId);

                if (myGames.length)
                    this.openGameChat(myGames[0]);
            });

            this.bindGames(true);
        }

        public games: ng.resource.IResourceArray<IGameResource> = [];
        public openGames: Array<IGameResource> = [];

        private bindTimeout: ng.IPromise<any>;

        private bindGames(immediate: boolean) {
            this.$timeout.cancel(this.bindTimeout);

            this.bindTimeout = this.$timeout(() => {
                if (this.games.$resolved !== false)
                    this.games = this.gamesRepository.getActiveGames();
            }, immediate ? 0 : 500, true);
        }

        public openGameChat(game) {
            if (this.openGames.indexOf(game) == -1)
                this.openGames.push(game);
        }

        public close(game) {
            var idx = this.openGames.indexOf(game);
            if (idx != -1)
                this.openGames.splice(idx, 1);
        }
    }

    export class GameChatContainerDirective implements ng.IDirective {
        static Injection: string = 'gameChatContainer'
        static $inject = [];

        public replace: boolean = true;
        public restrict: string = 'A';
        public templateUrl: string = '/Views/Shared/Directives/templates/game-chat-container-template.html';
        public scope: any = {
        };

        public controller = GameChatContainerController;
        public controllerAs: string = 'vm';

        constructor() {
        }

        private scrollContainer: JQuery;

        public link(scope: ng.IScope, element: JQuery, attrs: any) {
            this.scrollContainer = element.find('.scroll-container');
            this.scrollContainer.mCustomScrollbar();
        }

    }

    angular
        .module('app')
        .directive(GameChatContainerDirective.Injection, Activator.CreateFactory(GameChatContainerDirective));

}