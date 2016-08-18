module app {

    export class ResourceService {

        public static Injection: string = '$resources';
        public static $inject = [
            UtilityRepository.Injection
        ];

        private resources: any = {};

        constructor(
            private utilityRepository: UtilityRepository
        ) {

        }

        public resolve(value: string, callback: Function) {
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

            return this.resources[value] = '';
        }

        public load(value: string, callback: Function) {
            return this.resolve(value, callback);
        }

        public static factory() {
            var repo = (utilityRepository: UtilityRepository) => new ResourceService(utilityRepository);
            repo.$inject = ResourceService.$inject;
            return repo;
        }

    }


    angular
        .module('app')
        .factory(ResourceService.Injection, ResourceService.factory());
}