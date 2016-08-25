module app {

    interface GameHubEvents extends ISignalREvents {
        ReceiveMessage: string;
        StartTyping: string;
        CancelTyping: string;
        Initialize: string;
        UserJoined: string;
        UserLeft: string;
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
            ReceiveMessage: 'receiveMessage',
            StartTyping: 'startTyping',
            CancelTyping: 'cancelTyping',
            Initialize: 'initialize',
            UserJoined: 'userJoined',
            UserLeft: 'userLeft'
        };


        private static EventMap: StringStringDictionary = {
            receiveMessage: ActiveGameHubService.$events.ReceiveMessage,
            startTyping: ActiveGameHubService.$events.StartTyping,
            cancelTyping: ActiveGameHubService.$events.CancelTyping,
            initialize: ActiveGameHubService.$events.Initialize,
            userJoined: ActiveGameHubService.$events.UserJoined,
            userLeft: ActiveGameHubService.$events.UserLeft
        }

        private static ServerEvents: Array<string> = ['sendMessage', 'connectToGame', 'disconnectFromGame', 'startTyping', 'cancelTyping'];


        constructor(
            private Hub: ngSignalr.HubFactory
        ) {
            super('activeGameHub', Hub, ActiveGameHubService.EventMap, ActiveGameHubService.ServerEvents, false);
        }

        public SendMessage(gameId: string, message: string): ng.IPromise<void> {
            return this.executeServerMethod('sendMessage', gameId, message);
        }

        public Connect(gameId: string): ng.IPromise<void> {
            return this.executeServerMethod('connectToGame', gameId);
        }

        public Disconnect(gameId: string): ng.IPromise<void> {
            return this.executeServerMethod('disconnectFromGame', gameId);
        }

        public StartTyping(gameId: string): ng.IPromise<void> {
            return this.executeServerMethod('startTyping', gameId);
        }

        public CancelTyping(gameId: string): ng.IPromise<void> {
            return this.executeServerMethod('cancelTyping', gameId);
        }
    }

    angular
        .module('app')
        .factory(ActiveGameHubService.Injection, Activator.CreateFactory(ActiveGameHubService));
}