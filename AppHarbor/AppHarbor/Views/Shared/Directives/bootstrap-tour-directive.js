var app;
(function (app) {
    var BootstrapTourDirective = (function () {
        function BootstrapTourDirective($rootScope, $cookies, $state, $modal) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$cookies = $cookies;
            this.$state = $state;
            this.$modal = $modal;
            var userId = this.$rootScope.userInfo.id;
            Sideshow.config.language = "en";
            Sideshow.init();
            var modal;
            Sideshow.registerWizard({
                name: "siteTutorial",
                title: "Introduction",
                description: "Introducing the main features of our site.. ",
                estimatedTime: "1 Minute",
                affects: [
                    function () {
                        return _this.$state.current.name == app.RouteConfig.$routes.Tour;
                    }
                ],
                listeners: {
                    afterWizardEnds: function () {
                        _this.$cookies.put(userId + '.tourComplete', 'true');
                        _this.$state.go(app.RouteConfig.$routes.Home);
                    }
                }
            }).storyLine({
                showStepPosition: true,
                steps: [
                    {
                        title: "Welcome to MatchFinder!",
                        text: "MatchFinder is an application that matches up participants to play against each other in a scrim format.  We were originally created to help Rainbow Six: Siege players connect for custom games, such as tactical realism."
                    },
                    {
                        title: "Let's get started",
                        text: "This page is the games grid.  From this page you can view, create, and complete games against opponents.",
                        subject: '#divGamesGrid',
                        format: "markdown",
                        lockSubject: true
                    },
                    {
                        title: "Views",
                        text: "These are the views of current games that you have available.  You can swap between them as needed.",
                        subject: '#tabStrip',
                        format: "markdown",
                        lockSubject: true
                    },
                    {
                        title: "Join Game",
                        text: "This is the Join Game tab.  From here you can view games that <span class='text-info'>you've created</span> or games that have been created by others.",
                        subject: '#divGamesGrid',
                        lockSubject: true,
                        targets: "#tabJoinGame",
                        format: "markdown"
                    },
                    {
                        title: "Game Details",
                        text: "Click the <span class='fa fa-gears'></span> button to view the details of a game.  Click the <span class='fa fa-gears'></span> to continue.",
                        subject: 'body',
                        lockSubject: false,
                        targets: "[id^='cmdGameDetails_']",
                        format: "markdown",
                        completingConditions: [
                            function () {
                                return $('#detailsModal').is(':visible');
                            }
                        ],
                        autoContinue: true
                    },
                    {
                        title: "Game Details",
                        text: "This is the game details window.  It details all the different settings required to make a custom game.  Games can also be joined from in this window.",
                        format: "markdown",
                        subject: '#detailsModal',
                        lockSubject: true,
                        listeners: {
                            afterStep: function () {
                                $('#cmdClose').click();
                            }
                        }
                    },
                    {
                        title: "Delete Game",
                        text: "You can also delete <span class='text-info'>games that you've created.</span>  Only games that haven't been accepted may be deleted.",
                        subject: '#divGamesGrid',
                        lockSubject: true,
                        targets: "#cmdDeleteGame_demo",
                        format: "markdown",
                    },
                    {
                        title: "My Games",
                        text: "This view shows <span class='text-warning'>active games</span> and <span class='text-success'>completed games</span>.  In order to complete a game, you must rate the game by clicking the <span class='fa fa-check-circle'></span> button.",
                        format: "markdown",
                        subject: '#divGamesGrid',
                        targets: '#tabMyGames',
                        lockSubject: true,
                        listeners: {
                            beforeStep: function () {
                                $('#tabMyGames').click();
                            }
                        }
                    },
                    {
                        title: "Statistics",
                        text: "This view shows your statistics.  We don't track statistics in the normal way, just for reliability.  This helps us determine who is using our site correctly.",
                        format: "markdown",
                        subject: '#divGamesGrid',
                        targets: '#tabMyStats',
                        lockSubject: true,
                        listeners: {
                            beforeStep: function () {
                                $('#tabMyStats').click();
                            }
                        }
                    },
                    {
                        title: "Chat",
                        text: "Down here is our chat window.  This shows all chats for games that are <span class='text-warning'>active</span>.  From here you can chat with your opponent to discuss the current game.",
                        format: "markdown",
                        subject: '#divChatGamesList',
                        lockSubject: true
                    },
                    {
                        title: "Finish",
                        text: "You've completed the tutorial!  Now create or join a game to get started!",
                        format: "markdown"
                    }
                ]
            });
        }
        BootstrapTourDirective.prototype.link = function (scope, elem, attrs) {
            var tourComplete = this.$cookies.get(this.$rootScope.userInfo.id + '.tourComplete');
            if (this.$state.current.name == app.RouteConfig.$routes.Tour) {
                Sideshow.start({ wizardName: 'siteTutorial' });
            }
            else if (!tourComplete) {
                this.$state.go(app.RouteConfig.$routes.Tour);
            }
        };
        BootstrapTourDirective.Injection = 'bootstrapTour';
        BootstrapTourDirective.$inject = ['$rootScope', '$cookies', '$state', app.GameModalService.Injection];
        return BootstrapTourDirective;
    }());
    app.BootstrapTourDirective = BootstrapTourDirective;
    angular
        .module('app')
        .directive(BootstrapTourDirective.Injection, app.Activator.CreateFactory(BootstrapTourDirective));
})(app || (app = {}));
//# sourceMappingURL=bootstrap-tour-directive.js.map