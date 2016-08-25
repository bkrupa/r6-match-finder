var app;
(function (app) {
    var Activator = (function () {
        function Activator() {
        }
        Activator.CreateFactory = function (type) {
            var instance = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return new (type.bind.apply(type, [null].concat(args)));
            };
            instance.$inject = type.$inject;
            return instance;
        };
        return Activator;
    }());
    app.Activator = Activator;
})(app || (app = {}));
//# sourceMappingURL=activator-classes.js.map