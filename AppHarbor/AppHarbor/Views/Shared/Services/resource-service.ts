module app {

    interface StringStringDictionary {
        [resourceKey: string]: string;
    }

    export class ResourceService {

        public static Injection: string = '$resources';
        public static $inject = [
            UtilityRepository.Injection,
            '$q'
        ];

        private resources: StringStringDictionary = {};

        constructor(
            private utilityRepository: UtilityRepository,
            private $q: ng.IQService
        ) {

        }

        public resolve(value: string, callback: Function): string {
            if (this.resources.hasOwnProperty(value)) {
                if (callback)
                    callback(this.resources[value]);

                return this.resources[value];
            }

            var that = this;

            this.utilityRepository.getResource(value).then(function (response) {
                that.resources[value] = response || value;

                if (callback)
                    callback(response);
            });

            return '\xa0';
        }

        public load(value: string): ng.IPromise<string> {
            var deferred = this.$q.defer();

            this.resolve(value, (result) => {
                deferred.resolve(result);
            });

            return deferred.promise;
        }

        public static factory() {
            var repo = (utilityRepository: UtilityRepository, $q: ng.IQService) => new ResourceService(utilityRepository, $q);
            repo.$inject = ResourceService.$inject;
            return repo;
        }

    }


    angular
        .module('app')
        .factory(ResourceService.Injection, ResourceService.factory());
}