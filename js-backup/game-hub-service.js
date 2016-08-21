var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var GameHubService = (function (_super) {
        __extends(GameHubService, _super);
        function GameHubService(Hub) {
            _super.call(this, 'gameHub', Hub, GameHubService.EventMap, GameHubService.ServerEvents, false);
            this.Hub = Hub;
        }
        GameHubService.prototype.SendMessage = function (message) {
            return this.hub.sendMessage('BBC740E5-CA67-E611-BDAC-B2B8EA070CAD', message);
        };
        GameHubService.factory = function () {
            var service = function (Hub) { return new GameHubService(Hub); };
            service.$inject = GameHubService.$inject;
            return service;
        };
        GameHubService.Injection = 'gameHub';
        GameHubService.$inject = ['Hub'];
        GameHubService.$events = {
            Connecting: 'connecting',
            Connected: 'connected',
            Reconnecting: 'reconnecting',
            Disconnected: 'disconnected',
            Error: 'error',
            ReceiveMessage: 'receiveMessage'
        };
        GameHubService.EventMap = {
            receiveMessage: GameHubService.$events.ReceiveMessage
        };
        GameHubService.ServerEvents = ['sendMessage'];
        return GameHubService;
    }(app.BaseHubService));
    app.GameHubService = GameHubService;
    angular
        .module('app')
        .factory(GameHubService.Injection, GameHubService.factory());
})(app || (app = {}));
