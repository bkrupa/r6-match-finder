var app;
(function (app_1) {
    var app = angular.module('app', [
        'ngResource',
        'ngAnimate',
        'ui.bootstrap',
        'ui.router',
        'angular.filter',
        'SignalR'
    ]);
    //GLOBAL FUNCTIONS - pretty much a root/global controller.
    app.config(['$animateProvider', function ($animateProvider) {
            /* This is a fix.  The UI.Bootstrap carousel was broken when combined with ngAnimate */
            $animateProvider.classNameFilter(/carousel/);
        }]);
    ;
})(app || (app = {}));
//# sourceMappingURL=r6-main-module.js.map