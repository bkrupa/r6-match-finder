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
        ActiveGameHubService.prototype.SendMessage = function (message) {
            return this.hub.sendMessage('BBC740E5-CA67-E611-BDAC-B2B8EA070CAD', message);
        };
        ActiveGameHubService.factory = function () {
            var service = function (Hub) { return new ActiveGameHubService(Hub); };
            service.$inject = ActiveGameHubService.$inject;
            return service;
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
        ActiveGameHubService.ServerEvents = ['sendMessage'];
        return ActiveGameHubService;
    }(app.BaseHubService));
    app.ActiveGameHubService = ActiveGameHubService;
    angular
        .module('app')
        .factory(ActiveGameHubService.Injection, ActiveGameHubService.factory());
})(app || (app = {}));
