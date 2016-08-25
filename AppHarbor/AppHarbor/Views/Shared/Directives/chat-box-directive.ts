module app {
    interface IChatBoxDirectiveScope extends ng.IScope {
        game: IGameResource,
        vm: ChatBoxDirectiveController,
        onClose: Function
    }

    class ChatBoxDirectiveController {
        static Injection: string = 'chatBoxController';
        static $inject = ['$rootScope', '$scope', ActiveGameHubService.Injection];


        public message: string;
        private started: boolean = false;
        private connected: boolean = false;

        private otherUser: any;
        public game: any;

        constructor(
            private $rootScope: IAppRootScope,
            private $scope: IChatBoxDirectiveScope,
            private gameHub: ActiveGameHubService
        ) {
            this.gameHub.Connect($scope.game.id);

            this.gameHub.$on(ActiveGameHubService.$events.ReceiveMessage, (gameId, userId, msg) => {
                if (gameId == this.game.id)
                    $scope.$emit('addMessage', userId, msg);
            }).$on(ActiveGameHubService.$events.CancelTyping, (gameId, userId) => {
                if (gameId == this.game.id)
                    $scope.$emit('cancelTyping');
            }).$on(ActiveGameHubService.$events.StartTyping, (gameId, userId) => {
                if (gameId == this.game.id)
                    $scope.$emit('startTyping');
            }).$on(ActiveGameHubService.$events.Initialize, (gameId, userId, config) => {
                if (gameId == this.game.id) {
                    $scope.$emit('initialize', config);
                    this.initialize(config);
                }
            }).$on(ActiveGameHubService.$events.UserJoined, (gameId, userId, user) => {
                if (gameId == this.game.id) {
                    $scope.$apply(() => {
                        this.connected = true;
                    });

                    $scope.$emit('userJoined', user);
                }
            }).$on(ActiveGameHubService.$events.UserLeft, (gameId, userId, user) => {
                if (gameId == this.game.id) {
                    $scope.$apply(() => {
                        this.connected = false;
                    });

                    $scope.$emit('userLeft', user);
                }
            });
        }

        public sendMessage() {
            if ($.trim(this.message) == '')
                return false;

            this.gameHub.SendMessage(this.game.id, this.message);
            this.message = '';
            this.started = false;
        }

        public change() {
            if (this.message && this.message.trim() != '' && !this.started) {
                this.gameHub.StartTyping(this.game.id);
                this.started = true;
            }
            else if ((!this.message || this.message.trim() == '') && this.started) {
                this.gameHub.CancelTyping(this.game.id);
                this.started = false;
            }
        }

        public close() {
            this.gameHub.Disconnect(this.game.id);

            this.$scope.$emit('close');
        }

        public focused() {
            this.$scope.$emit('focused');
        }

        public toggleCollapse() {
            this.$scope.$emit('toggleCollapse');
        };

        private initialize(config): void {
            this.$scope.$apply((scope) => {
                this.otherUser = config.challenger;
                this.connected = config.isUserConnected;
            });
        }
    }


    export class ChatBoxDirective {
        static Injection: string = 'chatBox';
        static $inject = ['$rootScope'];

        public replace: boolean = true;
        public restrict: string = 'A';
        public templateUrl: string = '/Views/Shared/Directives/templates/chat-box-template.html';
        public scope: any = {
            game: '=chatBox',
            onClose: '&'
        };

        public controller = ChatBoxDirectiveController;
        public controllerAs: string = 'vm';


        constructor(
            private $rootScope: IAppRootScope
        ) {
        }

        private addMessage(scrollContainer: JQuery, msgElement: JQuery, message: any): void {
            if (message.fromUserId == this.$rootScope.userInfo.id) {
                $('<div class="message message-personal">' + message.message + '</div>').appendTo(scrollContainer).addClass('new');
            }
            else {
                ChatBoxDirective.cancelTyping(msgElement);
                $('<div class="message new"><figure class="avatar"><img src="/api/Users/' + message.fromUserId + '/Image" /></figure>' + message.message + '</div>').appendTo(scrollContainer).addClass('new');
            }
            ChatBoxDirective.setDate(new Date(message.date));
            ChatBoxDirective.updateScrollbar(msgElement);
        }

        private addConnectedMessage(scrollContainer: JQuery, msgElement: JQuery, user: any): void {
            $('<div class="message message-status new">' + user.username + ' Connected</div>').appendTo(scrollContainer);
            ChatBoxDirective.updateScrollbar(msgElement);
        }

        private addDisconnectedMessage(scrollContainer: JQuery, msgElement: JQuery, user: any): void {
            $('<div class="message message-status new">' + user.username + ' Disconnected</div>').appendTo(scrollContainer);
            ChatBoxDirective.updateScrollbar(msgElement);
        }

        private static startTyping(scrollContainer: JQuery, msgElement: JQuery, userId: string): void {
            $('<div class="message loading new"><figure class="avatar"><img src="/api/Users/' + userId + '/Image" /></figure><span></span></div>').appendTo(scrollContainer);
            this.updateScrollbar(msgElement);
        }

        private static cancelTyping(msgElement: JQuery): void {
            msgElement.find('.message.loading').remove();
            this.updateScrollbar(msgElement);
        }

        private initialize(scrollContainer: JQuery, msgElement: JQuery, config): void {

            for (var i = 0; i < config.history.length; i++) {
                this.addMessage(scrollContainer, msgElement, config.history[i]);
            }
        }

        private static setDate(d: Date) {
            //if (lastUpdate != d.getMinutes()) {
            //    lastUpdate = d.getMinutes();

            var stringM = "00" + d.getMinutes().toString();
            var timestamp = $('<div class="timestamp">' + d.getHours() + ':' + stringM.substring(stringM.length - 2, stringM.length) + '</div>');
            //}

            timestamp.appendTo($('.message:last'));
        }


        private static updateScrollbar(msgElement: JQuery) {
            msgElement.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
                scrollInertia: 10,
                timeout: 0
            });
        }


        public link(scope: IChatBoxDirectiveScope, element: JQuery, attrs: any) {
            var $messages: JQuery = element.find('.messages-content');
            var $messageBox: JQuery = element.find('.message-box');

            $messages.mCustomScrollbar({
                callbacks: {
                    onScroll: function () {
                        $messages.css('visibility', 'visible');
                    }
                }
            });

            var $scrollContainer: JQuery = element.find('.mCSB_container');
            scope.vm.game = scope.game;

            var collapsed: boolean = false;
            var latestTimestamp: JQuery;
            var gameConfig: any;

            scope.$on('toggleCollapse', (event) => {
                element.stop();

                if (collapsed) {
                    $messages.css('visibility', 'hidden');
                    $messages.css('opacity', 1);
                    element.animate({ height: 300 }, 'fast', () => {
                        ChatBoxDirective.updateScrollbar($messages);
                        setTimeout(() => $messages.css('visibility', 'visible'), 100);
                    });
                    $messageBox.fadeIn();
                    collapsed = false;
                }
                else {
                    element.animate({ height: 43 });
                    $messageBox.fadeOut();
                    $messages.css('visibility', 'hidden');
                    $messages.css('opacity', 0);
                    collapsed = true;
                }
            });

            scope.$on('focused', (event) => {
                element.removeClass('blink');
            });

            scope.$on('addMessage', (event, userId, msg) => {
                if (userId != this.$rootScope.userInfo.id)
                    element.addClass('blink');
                this.addMessage($scrollContainer, $messages, msg);
            });

            scope.$on('startTyping', (event) => {
                ChatBoxDirective.startTyping($scrollContainer, $messages, gameConfig.challenger.id);
            });

            scope.$on('cancelTyping', (event) => {
                ChatBoxDirective.cancelTyping($messages);
            });

            scope.$on('initialize', (event, config) => {
                gameConfig = config;
                this.initialize($scrollContainer, $messages, config);
                ChatBoxDirective.updateScrollbar($messages);
            });

            scope.$on('userJoined', (event, user) => {
                this.addConnectedMessage($scrollContainer, $messages, user);
            });

            scope.$on('userLeft', (event, user) => {
                this.addDisconnectedMessage($scrollContainer, $messages, user);
            });

            scope.$on('close', (event) => {
                element.remove();
                scope.onClose();
            });
        }
    }

    angular
        .module('app')
        .directive(ChatBoxDirective.Injection, Activator.CreateFactory(ChatBoxDirective));

}