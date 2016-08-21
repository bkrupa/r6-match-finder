module app {

    interface GameHubEvents extends ISignalREvents {
        ReceiveMessage: string;
    }

    export class ActiveGameHubService extends BaseHub {
        static Injection: string = 'activeGameHub';
        static $inject = ['Hub'];

        public static $events: GameHubEvents = {
            Connecting: 'connecting',
            Connected: 'connected',
            Reconnecting: 'reconnecting',
            Disconnected: 'disconnected',
            Error: 'error',
            ReceiveMessage: 'receiveMessage'
        };


        private static EventMap: StringStringDictionary = {
            receiveMessage: ActiveGameHubService.$events.ReceiveMessage
        }

        private static ServerEvents: Array<string> = ['sendMessage', 'connectToGame'];


        constructor(
            private Hub: ngSignalr.HubFactory
        ) {
            super('activeGameHub', Hub, ActiveGameHubService.EventMap, ActiveGameHubService.ServerEvents, false);
        }

        private gameId: string = 'BBC740E5-CA67-E611-BDAC-B2B8EA070CAD';

        public SendMessage(message: string): ng.IPromise<void> {
            return this.hub.sendMessage(this.gameId, message);
        }

        public Connect(): ng.IPromise<void> {
            return this.hub.connectToGame(this.gameId);
        }
    }

    angular
        .module('app')
        .factory(ActiveGameHubService.Injection, Activator.CreateFactory(ActiveGameHubService));
}