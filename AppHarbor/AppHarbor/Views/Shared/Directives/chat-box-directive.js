var app;
(function (app) {
    var ChatBoxDirectiveController = (function () {
        function ChatBoxDirectiveController($rootScope, $scope, gameHub) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.gameHub = gameHub;
            this.started = false;
            this.connected = false;
            this.gameHub.Connect($scope.game.id);
            this.gameHub.$on(app.ActiveGameHubService.$events.ReceiveMessage, function (gameId, userId, msg) {
                if (gameId == _this.game.id)
                    $scope.$emit('addMessage', userId, msg);
            }).$on(app.ActiveGameHubService.$events.CancelTyping, function (gameId, userId) {
                if (gameId == _this.game.id)
                    $scope.$emit('cancelTyping');
            }).$on(app.ActiveGameHubService.$events.StartTyping, function (gameId, userId) {
                if (gameId == _this.game.id)
                    $scope.$emit('startTyping');
            }).$on(app.ActiveGameHubService.$events.Initialize, function (gameId, userId, config) {
                if (gameId == _this.game.id) {
                    $scope.$emit('initialize', config);
                    _this.initialize(config);
                }
            }).$on(app.ActiveGameHubService.$events.UserJoined, function (gameId, userId, user) {
                if (gameId == _this.game.id) {
                    $scope.$apply(function () {
                        _this.connected = true;
                    });
                    $scope.$emit('userJoined', user);
                }
            }).$on(app.ActiveGameHubService.$events.UserLeft, function (gameId, userId, user) {
                if (gameId == _this.game.id) {
                    $scope.$apply(function () {
                        _this.connected = false;
                    });
                    $scope.$emit('userLeft', user);
                }
            });
        }
        ChatBoxDirectiveController.prototype.sendMessage = function () {
            if ($.trim(this.message) == '')
                return false;
            this.gameHub.SendMessage(this.game.id, this.message);
            this.message = '';
            this.started = false;
        };
        ChatBoxDirectiveController.prototype.change = function () {
            if (this.message && this.message.trim() != '' && !this.started) {
                this.gameHub.StartTyping(this.game.id);
                this.started = true;
            }
            else if ((!this.message || this.message.trim() == '') && this.started) {
                this.gameHub.CancelTyping(this.game.id);
                this.started = false;
            }
        };
        ChatBoxDirectiveController.prototype.close = function () {
            this.gameHub.Disconnect(this.game.id);
            this.$scope.$emit('close');
        };
        ChatBoxDirectiveController.prototype.focused = function () {
            this.$scope.$emit('focused');
        };
        ChatBoxDirectiveController.prototype.toggleCollapse = function () {
            this.$scope.$emit('toggleCollapse');
        };
        ;
        ChatBoxDirectiveController.prototype.initialize = function (config) {
            var _this = this;
            this.$scope.$apply(function (scope) {
                _this.otherUser = config.challenger;
                _this.connected = config.isUserConnected;
            });
        };
        ChatBoxDirectiveController.Injection = 'chatBoxController';
        ChatBoxDirectiveController.$inject = ['$rootScope', '$scope', app.ActiveGameHubService.Injection];
        return ChatBoxDirectiveController;
    }());
    var ChatBoxDirective = (function () {
        function ChatBoxDirective($rootScope) {
            this.$rootScope = $rootScope;
            this.replace = true;
            this.restrict = 'A';
            this.templateUrl = '/Views/Shared/Directives/templates/chat-box-template.html';
            this.scope = {
                game: '=chatBox',
                onClose: '&'
            };
            this.controller = ChatBoxDirectiveController;
            this.controllerAs = 'vm';
        }
        ChatBoxDirective.prototype.addMessage = function (scrollContainer, msgElement, message) {
            if (message.fromUserId == this.$rootScope.userInfo.id) {
                $('<div class="message message-personal">' + message.message + '</div>').appendTo(scrollContainer).addClass('new');
            }
            else {
                ChatBoxDirective.cancelTyping(msgElement);
                $('<div class="message new"><figure class="avatar"><img src="/api/Users/' + message.fromUserId + '/Image" /></figure>' + message.message + '</div>').appendTo(scrollContainer).addClass('new');
            }
            ChatBoxDirective.setDate(new Date(message.date));
            ChatBoxDirective.updateScrollbar(msgElement);
        };
        ChatBoxDirective.prototype.addConnectedMessage = function (scrollContainer, msgElement, user) {
            $('<div class="message message-status new">' + user.username + ' Connected</div>').appendTo(scrollContainer);
            ChatBoxDirective.updateScrollbar(msgElement);
        };
        ChatBoxDirective.prototype.addDisconnectedMessage = function (scrollContainer, msgElement, user) {
            $('<div class="message message-status new">' + user.username + ' Disconnected</div>').appendTo(scrollContainer);
            ChatBoxDirective.updateScrollbar(msgElement);
        };
        ChatBoxDirective.startTyping = function (scrollContainer, msgElement, userId) {
            $('<div class="message loading new"><figure class="avatar"><img src="/api/Users/' + userId + '/Image" /></figure><span></span></div>').appendTo(scrollContainer);
            this.updateScrollbar(msgElement);
        };
        ChatBoxDirective.cancelTyping = function (msgElement) {
            msgElement.find('.message.loading').remove();
            this.updateScrollbar(msgElement);
        };
        ChatBoxDirective.prototype.initialize = function (scrollContainer, msgElement, config) {
            for (var i = 0; i < config.history.length; i++) {
                this.addMessage(scrollContainer, msgElement, config.history[i]);
            }
        };
        ChatBoxDirective.setDate = function (d) {
            var stringM = "00" + d.getMinutes().toString();
            var timestamp = $('<div class="timestamp">' + d.getHours() + ':' + stringM.substring(stringM.length - 2, stringM.length) + '</div>');
            timestamp.appendTo($('.message:last'));
        };
        ChatBoxDirective.updateScrollbar = function (msgElement) {
            msgElement.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
                scrollInertia: 10,
                timeout: 0
            });
        };
        ChatBoxDirective.prototype.link = function (scope, element, attrs) {
            var _this = this;
            var $messages = element.find('.messages-content');
            var $messageBox = element.find('.message-box');
            $messages.mCustomScrollbar({
                callbacks: {
                    onScroll: function () {
                        $messages.css('visibility', 'visible');
                    }
                }
            });
            var $scrollContainer = element.find('.mCSB_container');
            scope.vm.game = scope.game;
            var collapsed = false;
            var latestTimestamp;
            var gameConfig;
            scope.$on('toggleCollapse', function (event) {
                element.stop();
                if (collapsed) {
                    $messages.css('visibility', 'hidden');
                    $messages.css('opacity', 1);
                    element.animate({ height: 300 }, 'fast', function () {
                        ChatBoxDirective.updateScrollbar($messages);
                        setTimeout(function () { return $messages.css('visibility', 'visible'); }, 100);
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
            scope.$on('focused', function (event) {
                element.removeClass('blink');
            });
            scope.$on('addMessage', function (event, userId, msg) {
                if (userId != _this.$rootScope.userInfo.id)
                    element.addClass('blink');
                _this.addMessage($scrollContainer, $messages, msg);
            });
            scope.$on('startTyping', function (event) {
                ChatBoxDirective.startTyping($scrollContainer, $messages, gameConfig.challenger.id);
            });
            scope.$on('cancelTyping', function (event) {
                ChatBoxDirective.cancelTyping($messages);
            });
            scope.$on('initialize', function (event, config) {
                gameConfig = config;
                _this.initialize($scrollContainer, $messages, config);
                ChatBoxDirective.updateScrollbar($messages);
            });
            scope.$on('userJoined', function (event, user) {
                _this.addConnectedMessage($scrollContainer, $messages, user);
            });
            scope.$on('userLeft', function (event, user) {
                _this.addDisconnectedMessage($scrollContainer, $messages, user);
            });
            scope.$on('close', function (event) {
                element.remove();
                scope.onClose();
            });
        };
        ChatBoxDirective.Injection = 'chatBox';
        ChatBoxDirective.$inject = ['$rootScope'];
        return ChatBoxDirective;
    }());
    app.ChatBoxDirective = ChatBoxDirective;
    angular
        .module('app')
        .directive(ChatBoxDirective.Injection, app.Activator.CreateFactory(ChatBoxDirective));
})(app || (app = {}));
