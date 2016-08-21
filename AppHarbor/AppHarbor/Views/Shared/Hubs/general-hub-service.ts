module app {

    interface GeneralHubEvents extends ISignalREvents {
        RefreshGameList: string;
        Test: string;
    }

    export class GeneralHubService extends BaseHub {
        static Injection: string = 'generalHub';
        static $inject = ['Hub'];

        public static $events: GeneralHubEvents = {
            RefreshGameList: 'refreshGameList',
            Test: 'test',
            Connecting: 'connecting',
            Connected: 'connected',
            Reconnecting: 'reconnecting',
            Disconnected: 'disconnected',
            Error: 'error'
        };


        private static EventMap: StringStringDictionary = {
            refreshGamesList: GeneralHubService.$events.RefreshGameList
        }

        private static ServerEvents: Array<string> = [];


        constructor(
            private Hub: ngSignalr.HubFactory
        ) {
            super('generalHub', Hub, GeneralHubService.EventMap, GeneralHubService.ServerEvents, false);
        }
    }

    angular
        .module('app')
        .factory(GeneralHubService.Injection, Activator.CreateFactory(GeneralHubService));
}