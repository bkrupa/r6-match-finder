var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var ActiveGameHubService = (function (_super) {
        __extends(ActiveGameHubService, _super);
        function ActiveGameHubService(Hub) {
            _super.call(this, 'activeGameHub', Hub, ActiveGameHubService.EventMap, ActiveGameHubService.ServerEvents, false);
            this.Hub = Hub;
        }
        ActiveGameHubService.prototype.SendMessage = function (gameId, message) {
            return this.executeServerMethod('sendMessage', gameId, message);
        };
        ActiveGameHubService.prototype.Connect = function (gameId) {
            return this.executeServerMethod('connectToGame', gameId);
        };
        ActiveGameHubService.prototype.StartTyping = function (gameId) {
            return this.executeServerMethod('startTyping', gameId);
        };
        ActiveGameHubService.prototype.CancelTyping = function (gameId) {
            return this.executeServerMethod('cancelTyping', gameId);
        };
        ActiveGameHubService.Injection = 'activeGameHub';
        ActiveGameHubService.$inject = ['Hub'];
        ActiveGameHubService.$events = {
            Connecting: 'connecting',
            Connected: 'connected',
            Reconnecting: 'reconnecting',
            Disconnected: 'disconnected',
            Error: 'error',
            ReceiveMessage: 'receiveMessage',
            StartTyping: 'startTyping',
            CancelTyping: 'cancelTyping',
            Initialize: 'initialize'
        };
        ActiveGameHubService.EventMap = {
            receiveMessage: ActiveGameHubService.$events.ReceiveMessage,
            startTyping: ActiveGameHubService.$events.StartTyping,
            cancelTyping: ActiveGameHubService.$events.CancelTyping,
            initialize: ActiveGameHubService.$events.Initialize
        };
        ActiveGameHubService.ServerEvents = ['sendMessage', 'connectToGame', 'startTyping', 'cancelTyping'];
        return ActiveGameHubService;
    }(app.BaseHub));
    app.ActiveGameHubService = ActiveGameHubService;
    angular
        .module('app')
        .factory(ActiveGameHubService.Injection, app.Activator.CreateFactory(ActiveGameHubService));
})(app || (app = {}));
