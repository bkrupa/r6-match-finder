var app;
(function (app) {
    var AppRootScope = (function () {
        function AppRootScope() {
        }
        AppRootScope.prototype.resource = function () {
        };
        return AppRootScope;
    }());
    app.AppRootScope = AppRootScope;
})(app || (app = {}));
