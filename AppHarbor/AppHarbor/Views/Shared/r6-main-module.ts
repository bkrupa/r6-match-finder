﻿module app {

    declare var CONSTANTS: any;

    var app = angular.module('app', [
        'ngResource',
        'ngAnimate',
        'ngCookies',
        'ui.bootstrap',
        'ui.router',
        'angular.filter',
        'SignalR'
    ]);





    //GLOBAL FUNCTIONS - pretty much a root/global controller.
    app.config(['$animateProvider', function ($animateProvider) {
        /* This is a fix.  The UI.Bootstrap carousel was broken when combined with ngAnimate */
        $animateProvider.classNameFilter(/carousel/);
    }]);;
}