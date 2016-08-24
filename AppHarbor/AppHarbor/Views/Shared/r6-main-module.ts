module app {

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

    /*************************************************************************************
        This file contains some utility functions applied to the root scope
    *************************************************************************************/
    /******** GLOBAL FUNCTIONS

    app.constant('APIBase', '/api');
    app.constant('Enums', {});

    app.run(['$rootScope', '$timeout', '$location', '$anchorScroll', '$locale', '$state', '$http', 'uibDatepickerConfig', '$resources', 'utilityRepository', 'accountRepository',
        function ($rootScope, $timeout, $location, $anchorScroll, $locale, $state, $http, uibDatepickerConfig, $resources, utilityRepository, accountRepository) {
            // Configure Toastr
            toastr.options = {
                "debug": false,
                "positionClass": "toast-top-right",
                "onclick": null,
                "timeOut": 5000,
                "extendedTimeOut": 1000
            }

            $rootScope.module = 'Main';

            $rootScope.authentication = accountRepository.getCurrentUserInfo()
            utilityRepository.bindVersion();
            utilityRepository.bindEnums();

            $rootScope.range = function (count, start) {
                start = start || 0;

                if (!count || count <= 0)
                    return [];

                var ar = [];
                for (var i = start; i < count + start; i++)
                    ar.push(i);
                return ar;
            };

            $rootScope.toArray = function (obj, intsOnly) {
                return $.map(obj, function (value, index) {
                    return [value];
                });
            };

            $rootScope.enumToDictionary = function (arr) {
                return arr.reduce(function (o, v, i) {
                    o[v.id] = v;
                    return o;
                }, {});
            };

            var resources = {};
            $rootScope.resource = function (value, callback) {
                return $resources.resolve(value, callback);
            };

            uibDatepickerConfig.showWeeks = false;
            uibDatepickerConfig.showButtonBar = false;

            // Filter to invert the value of a filter function
            $rootScope.not = function (func) {
                return function (item) {
                    return !func(item);
                }
            };

            $rootScope.showLoadingPanel = function (force) {
                $rootScope._showLoadingPanel = true;

                if (force)
                    $rootScope._forceLoadingPanel = true;
            };
            $rootScope.hideLoadingPanel = function () {
                $rootScope._showLoadingPanel = false;
                $rootScope._forceLoadingPanel = false;
            };
            $rootScope.setLoadingText = function (txt) { $rootScope.loadingText = txt; };

            $rootScope.Math = Math;
            $rootScope.isNaN = isNaN;
            $rootScope.parseInt = parseInt; 1
            $rootScope.parseFloat = parseFloat;
            $rootScope.locale = $locale;

            $rootScope.$on('$stateNotFound', function () {
                alert('This module is not yet implemented.  This will be fixed in the future.');
            });

            $rootScope.getUtcDate = function () {
                return new Date();
            };

            $rootScope.generateGuid = function (separator) {
                var delim = separator || "-";

                function S4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }

                return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
            };

            // Anchor Scrolling
            $rootScope.goToAnchor = function (id) {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash(id);
                $anchorScroll();
            };
        }
    ])
        .factory('loadingInterceptor', [
            '$q', '$injector', '$rootScope', '$timeout', function ($q, $injector, $rootScope, $timeout) {
                var $http;

                return {
                    request: function (config) {
                        $rootScope.loading = true;
                        $rootScope.delayedBind = false;
                        return config;
                    },
                    response: function success(response) {
                        $http = $http || $injector.get('$http');
                        if ($http.pendingRequests.length < 1) {
                            $rootScope.loading = false;
                            $timeout(function () { $rootScope.initialLoad = false; }, 100);
                        }
                        return response;
                    },
                    responseError: function error(response) {
                        $http = $http || $injector.get('$http');
                        if ($http.pendingRequests.length < 1) {
                            $rootScope.loading = false;
                            $timeout(function () { $rootScope.initialLoad = false; }, 100);
                        }
                        return $q.reject(response);
                    }
                };
            }
        ])
        .factory('errorHttpInterceptor', [
            '$q', '$rootScope', function ($q, $rootScope) {
                return {
                    responseError: function responseError(response) {
                        if (response.data.exceptionMessage)
                            toastr.error(response.data.exceptionMessage);
                        else if (typeof response.data == 'string')
                            toastr.error(response.data);
                        return $q.reject(response);
                    }
                };
            }
        ])
        .config([
            '$httpProvider', function ($httpProvider) {
                $httpProvider.interceptors.push('loadingInterceptor');
                $httpProvider.interceptors.push('errorHttpInterceptor');

                var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

                function convertDateStringsToDates(input) {
                    // Ignore things that aren't objects.
                    if (typeof input !== "object") return input;

                    for (var key in input) {
                        if (!input.hasOwnProperty(key)) continue;

                        var value = input[key];
                        var match;
                        // Check for string properties which look like dates.
                        if (typeof value === "string" && (match = value.match(regexIso8601))) {
                            var milliseconds = Date.parse(match[0])
                            if (!isNaN(milliseconds)) {
                                input[key] = new Date(milliseconds);
                            }
                        } else if (typeof value === "object") {
                            // Recurse into object
                            convertDateStringsToDates(value);
                        }
                    }
                }

                $httpProvider.defaults.transformResponse.push(function (responseData) {
                    convertDateStringsToDates(responseData);
                    return responseData;
                });
            }
        ]);

        ****************/

}