module app {
    export class MapsRepository {
        static Injection: string = 'mapsRepository';
        static $inject = [
            '$resource'
        ];

        private resource: any;

        constructor($resource: ng.resource.IResourceService) {
            var that: MapsRepository = this;
            this.resource = $resource('/api/Maps/:id/:action', { action: '@action', id: '@id' });
        }

        public getAll(): ng.resource.IResourceArray<any> {
            return this.resource.query();
        }

        public get(id: string): any {
            return this.resource.get({
                id: id
            });
        }

        public create(): any {
            return this.resource.get({
                action: 'new'
            });
        }
    }

    angular
        .module('app')
        .factory(MapsRepository.Injection, Activator.CreateFactory(MapsRepository));

}