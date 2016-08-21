var app;
(function (app) {
    var BaseHub = (function () {
        function BaseHub(hubName, hubFactory, eventMap, serverMethods, enableLogging) {
            var _this = this;
            this.hubName = hubName;
            this.hubFactory = hubFactory;
            this.eventMap = eventMap;
            this.serverMethods = serverMethods;
            this.enableLogging = enableLogging;
            this.$eventHandlers = {};
            this.options = {
                listeners: this.GetListeners(),
                logging: this.enableLogging,
                methods: this.serverMethods,
                errorHandler: this.onSignalRError,
                stateChanged: function (state) {
                    switch (state.newState) {
                        case $.signalR.connectionState.connecting:
                            _this.callFn(app.GeneralHubService.$events.Connecting, null);
                            break;
                        case $.signalR.connectionState.connected:
                            _this.callFn(app.GeneralHubService.$events.Connected, null);
                            break;
                        case $.signalR.connectionState.reconnecting:
                            _this.callFn(app.GeneralHubService.$events.Reconnecting, null);
                            break;
                        case $.signalR.connectionState.disconnected:
                            _this.callFn(app.GeneralHubService.$events.Disconnected, null);
                            break;
                    }
                }
            };
            this.hub = new hubFactory(hubName, this.options);
        }
        BaseHub.prototype.onSignalRError = function (error) {
            this.callFn(app.GeneralHubService.$events.Disconnected, null);
            console.error(error);
        };
        BaseHub.prototype.GetListeners = function () {
            var that = this;
            var listeners = {};
            angular.forEach(Object.keys(that.eventMap), function (k) {
                listeners[k] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    that.callFn(that.eventMap[k], args);
                };
            });
            return listeners;
        };
        BaseHub.prototype.$on = function (event, callback) {
            var handlers = this.$eventHandlers[event] || new Array();
            this.$eventHandlers[event] = handlers;
            if (handlers.indexOf(callback) == -1)
                handlers.push(callback);
            return this;
        };
        BaseHub.prototype.$off = function (event, callback) {
            var handlers = this.$eventHandlers[event] || new Array();
            var idx = handlers.indexOf(callback);
            handlers.splice(idx, 1);
            return this;
        };
        BaseHub.prototype.log = function (msg) {
            msg = "[" + new Date().toTimeString() + "] BaseHub: " + msg;
            console.debug(msg);
        };
        BaseHub.prototype.callFn = function (event, args) {
            var handlers = this.$eventHandlers[event];
            if (this.enableLogging)
                this.log("'" + event + "' event fired");
            if (handlers) {
                for (var i = 0; i < handlers.length; i++)
                    handlers[i].apply(null, args);
            }
        };
        return BaseHub;
    }());
    app.BaseHub = BaseHub;
})(app || (app = {}));
//# sourceMappingURL=base-hub-classes.js.map