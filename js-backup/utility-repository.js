var app;
(function (app) {
    var UtilityRepository = (function () {
        function UtilityRepository($http, $q, Enums) {
            this.$http = $http;
            this.$q = $q;
            this.Enums = Enums;
            this.requestedResources = {};
        }
        UtilityRepository.prototype.bindVersion = function () {
            this.$http.get('/api/Utilities/Version').then(function (response) {
                // Set this here at some point in the future
            });
        };
        UtilityRepository.prototype.bindEnums = function () {
            var promise = this.$http.get('/api/Utilities/Enums');
            var Enums = this.Enums;
            Enums.$promise = promise;
            promise.then(function (response) {
                $.extend(Enums, response.data);
            });
            return promise;
        };
        UtilityRepository.prototype.getResource = function (value) {
            if (this.requestedResources.hasOwnProperty(value))
                return this.requestedResources[value].promise;
            var that = this;
            clearTimeout(this.resourceTimeout);
            var deferred = this.$q.defer();
            this.requestedResources[value] = deferred;
            this.resourceTimeout = setTimeout(function () {
                var resources = that.requestedResources;
                that.requestedResources = {};
                that.$http.post('/api/Utilities/Resources', Object.keys(resources)).then(function (response) {
                    for (var key in response.data)
                        if (resources.hasOwnProperty(key))
                            resources[key].resolve(response.data[key]);
                }, function (err) {
                    for (var key in resources)
                        resources[key].reject(err);
                });
            }, 100);
            return deferred.promise;
        };
        UtilityRepository.factory = function () {
            var repo = function ($http, $q, Enums) { return new UtilityRepository($http, $q, Enums); };
            repo.$inject = UtilityRepository.$inject;
            return repo;
        };
        UtilityRepository.Injection = 'utilityRepository';
        UtilityRepository.$inject = [
            '$http',
            '$q',
            'Enums'
        ];
        return UtilityRepository;
    }());
    app.UtilityRepository = UtilityRepository;
    angular
        .module('app')
        .factory(UtilityRepository.Injection, UtilityRepository.factory());
})(app || (app = {}));
