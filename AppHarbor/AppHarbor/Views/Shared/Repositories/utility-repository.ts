module app {

    interface StringDeferredDictionary {
        [resourceKey: string]: ng.IDeferred<string>;
    }

    export class UtilityRepository {
        static Injection: string = 'utilityRepository';

        static $inject = [
            '$http',
            '$q',
            'Enums'
        ];

        private resourceTimeout: number;
        private requestedResources: StringDeferredDictionary = {};

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private Enums: any
        ) {
        }

        public bindVersion() {
            this.$http.get('/api/Utilities/Version').then(function (response) {
                // Set this here at some point in the future
            });
        }

        public bindEnums() {
            var promise = this.$http.get('/api/Utilities/Enums')
            var Enums = this.Enums;

            Enums.$promise = promise;

            promise.then(function (response) {
                $.extend(Enums, response.data);
            });

            return promise;
        }

        public getResource(value: string): ng.IPromise<string> {
            if (this.requestedResources.hasOwnProperty(value))
                return this.requestedResources[value].promise;

            var that = this;

            clearTimeout(this.resourceTimeout);

            var deferred = this.$q.defer();
            this.requestedResources[value] = deferred;

            this.resourceTimeout = setTimeout(function () {
                var resources = that.requestedResources;
                that.requestedResources = {};

                that.$http.post('/api/Utilities/Resources', Object.keys(resources)).then((response) => {
                    for (var key in response.data)
                        if (resources.hasOwnProperty(key))
                            resources[key].resolve(response.data[key]);

                }, function (err) {
                    for (var key in resources)
                        resources[key].reject(err);
                });
            }, 100);

            return deferred.promise;
        }
    }

    angular
        .module('app')
        .factory(UtilityRepository.Injection, Activator.CreateFactory(UtilityRepository));
}