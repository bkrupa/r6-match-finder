module app {


    export class GamesRepository {
        static Injection: string = 'gamesRepository';
        static $inject = [
            '$resource'
        ];

        private gamesResource: ng.resource.IResourceClass<any>;

        constructor($resource: ng.resource.IResourceService) {
            this.gamesResource = $resource('/api/Games/:action/:id', { action: '@action', id: '@id' });
        }

        public getAll(): Array<any> {
            return this.gamesResource.query();
        }

        public get(id: string): any {
            return this.gamesResource.get({
                id: id
            });
        }

        public create(): any {
            return this.gamesResource.get({
                action: 'new'
            });
        }
    }

    angular
        .module('app')
        .factory(GamesRepository.Injection, ['$resource', ($resource) => { return new GamesRepository($resource); }]);

}