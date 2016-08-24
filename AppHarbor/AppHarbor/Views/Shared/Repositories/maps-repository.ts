module app {
    export class MapsRepository {
        static Injection: string = 'mapsRepository';
        static $inject = [
            '$resource',
            '$cacheFactory'
        ];

        private resource: any;
        private cache: ng.ICacheObject;

        constructor($resource: ng.resource.IResourceService,
            $cacheFactory: ng.ICacheFactoryService) {
            var that: MapsRepository = this;
            this.resource = $resource('/api/Maps/:id/:action', { action: '@action', id: '@id' });

            this.cache = $cacheFactory(MapsRepository.Injection);
        }

        public getAll(): ng.resource.IResourceArray<any> {
            var maps = <ng.resource.IResourceArray<any>>this.cache.get('maps');

            if (maps)
                return maps;

            maps = this.resource.query();
            this.cache.put('maps', maps);
            return maps;
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