var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var GeneralHubService = (function (_super) {
        __extends(GeneralHubService, _super);
        function GeneralHubService(Hub) {
            _super.call(this, 'generalHub', Hub, GeneralHubService.EventMap, GeneralHubService.ServerEvents, false);
            this.Hub = Hub;
        }
        GeneralHubService.Injection = 'generalHub';
        GeneralHubService.$inject = ['Hub'];
        GeneralHubService.$events = {
            RefreshGameList: 'refreshGameList',
            Connecting: 'connecting',
            Connected: 'connected',
            Reconnecting: 'reconnecting',
            Disconnected: 'disconnected',
            Error: 'error'
        };
        GeneralHubService.EventMap = {
            refreshGamesList: GeneralHubService.$events.RefreshGameList
        };
        GeneralHubService.ServerEvents = [];
        return GeneralHubService;
    }(app.BaseHub));
    app.GeneralHubService = GeneralHubService;
    angular
        .module('app')
        .factory(GeneralHubService.Injection, app.Activator.CreateFactory(GeneralHubService));
})(app || (app = {}));
//# sourceMappingURL=general-hub-service.js.map