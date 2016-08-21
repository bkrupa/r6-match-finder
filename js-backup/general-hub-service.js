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
        GeneralHubService.prototype.Test = function () {
            return this.hub.test();
        };
        GeneralHubService.prototype.ForceRefresh = function () {
            return this.hub.forceRefresh();
        };
        GeneralHubService.factory = function () {
            var service = function (Hub) { return new GeneralHubService(Hub); };
            service.$inject = GeneralHubService.$inject;
            return service;
        };
        GeneralHubService.Injection = 'generalHub';
        GeneralHubService.$inject = ['Hub'];
        GeneralHubService.$events = {
            RefreshGameList: 'refreshGameList',
            Test: 'test',
            Connecting: 'connecting',
            Connected: 'connected',
            Reconnecting: 'reconnecting',
            Disconnected: 'disconnected',
            Error: 'error'
        };
        GeneralHubService.EventMap = {
            refreshGamesList: GeneralHubService.$events.RefreshGameList,
            test: GeneralHubService.$events.Test
        };
        GeneralHubService.ServerEvents = ['test', 'forceRefresh'];
        return GeneralHubService;
    }(app.BaseHubService));
    app.GeneralHubService = GeneralHubService;
    angular
        .module('app')
        .factory(GeneralHubService.Injection, GeneralHubService.factory());
})(app || (app = {}));
