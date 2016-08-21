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
            this.gameId = 'BBC740E5-CA67-E611-BDAC-B2B8EA070CAD';
        }
        ActiveGameHubService.prototype.SendMessage = function (message) {
            return this.hub.sendMessage(this.gameId, message);
        };
        ActiveGameHubService.prototype.Connect = function () {
            return this.hub.connectToGame(this.gameId);
        };
        ActiveGameHubService.Injection = 'activeGameHub';
        ActiveGameHubService.$inject = ['Hub'];
        ActiveGameHubService.$events = {
            Connecting: 'connecting',
            Connected: 'connected',
            Reconnecting: 'reconnecting',
            Disconnected: 'disconnected',
            Error: 'error',
            ReceiveMessage: 'receiveMessage'
        };
        ActiveGameHubService.EventMap = {
            receiveMessage: ActiveGameHubService.$events.ReceiveMessage
        };
        ActiveGameHubService.ServerEvents = ['sendMessage', 'connectToGame'];
        return ActiveGameHubService;
    }(app.BaseHub));
    app.ActiveGameHubService = ActiveGameHubService;
    angular
        .module('app')
        .factory(ActiveGameHubService.Injection, app.Activator.CreateFactory(ActiveGameHubService));
})(app || (app = {}));
//# sourceMappingURL=active-game-hub-service.js.map