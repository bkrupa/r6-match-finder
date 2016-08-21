module app {
    export abstract class BaseHub {
        protected $eventHandlers: EventDictionary = {};

        private options: ngSignalr.HubOptions = {
            listeners: this.GetListeners(),
            logging: this.enableLogging,
            methods: this.serverMethods,
            errorHandler: this.onSignalRError,
            stateChanged: (state) => {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        this.callFn(GeneralHubService.$events.Connecting, null);
                        break;
                    case $.signalR.connectionState.connected:
                        this.callFn(GeneralHubService.$events.Connected, null);
                        break;
                    case $.signalR.connectionState.reconnecting:
                        this.callFn(GeneralHubService.$events.Reconnecting, null);
                        break;
                    case $.signalR.connectionState.disconnected:
                        this.callFn(GeneralHubService.$events.Disconnected, null);
                        break;
                }
            }
        };

        private onSignalRError(error) {
            this.callFn(GeneralHubService.$events.Disconnected, null);
            console.error(error);
        }

        constructor(
            protected hubName: string,
            private hubFactory: ngSignalr.HubFactory,
            private eventMap: StringStringDictionary,
            private serverMethods: Array<string>,
            private enableLogging: boolean) {
            this.hub = new hubFactory(hubName, this.options);
        }

        protected hub: any;

        private GetListeners(): any {
            var that = this;
            var listeners = {};

            angular.forEach(Object.keys(that.eventMap), (k) => {
                listeners[k] = (...args: any[]) => {
                    that.callFn(that.eventMap[k], args);
                };
            });

            return listeners;
        }

        public $on(event: string, callback: (...args: any[]) => any): BaseHub {
            var handlers = this.$eventHandlers[event] || new Array<(...args: any[]) => any>();
            this.$eventHandlers[event] = handlers;

            if (handlers.indexOf(callback) == -1)
                handlers.push(callback);

            return this;
        }

        public $off(event: string, callback: (...args: any[]) => any): BaseHub {
            var handlers = this.$eventHandlers[event] || new Array<(...args: any[]) => any>();
            var idx = handlers.indexOf(callback);
            handlers.splice(idx, 1);

            return this;
        }

        private log(msg) {
            msg = "[" + new Date().toTimeString() + "] BaseHub: " + msg;
            console.debug(msg);
        }


        private callFn(event: string, args: any[]): void {
            var handlers = this.$eventHandlers[event];

            if (this.enableLogging)
                this.log("'" + event + "' event fired");

            if (handlers) {
                for (var i = 0; i < handlers.length; i++)
                    handlers[i].apply(null, args);
            }
        }
    }
}