module app {
    export interface IGameResource extends ng.resource.IResource<any> {
        id: string;
        userId: string;
        date: Date;
        rules: number;
        time: number;
        hud: number;
        mode: number;
        playersPerTeam: number;

        $join(): void;
    }


    export class GamesRepository {
        static Injection: string = 'gamesRepository';
        static $inject = [
            '$resource'
        ];

        private gamesResource: ng.resource.IResourceClass<any>;

        constructor($resource: ng.resource.IResourceService) {
            var that: GamesRepository = this;
            this.gamesResource = $resource('/api/Games/:id/:action', { action: '@action', id: '@id' });

            this.gamesResource.prototype.$join = function (): ng.resource.IResource<any> {
                return that.gamesResource.save({
                    action: 'Join',
                    id: this.id
                });
            };

            this.gamesResource.prototype.$complete = function (rating): ng.resource.IResource<any> {
                return that.gamesResource.save({
                    action: 'Complete',
                    id: this.id
                }, rating);
            };

            this.gamesResource.prototype.$rate = function (rating): ng.resource.IResource<any> {
                return that.gamesResource.save({
                    action: 'Rate',
                    id: this.id
                }, rating);
            };
        }

        public getAll(): Array<IGameResource> {
            return this.gamesResource.query();
        }

        public get(id: string): IGameResource {
            return this.gamesResource.get({
                id: id
            });
        }

        public create(): IGameResource {
            return this.gamesResource.get({
                action: 'new'
            });
        }

        public getMyGames(): Array<IGameResource> {
            return this.gamesResource.query({
                action: 'MyGames'
            });
        }
    }

    angular
        .module('app')
        .factory(GamesRepository.Injection, ['$resource', ($resource) => { return new GamesRepository($resource); }]);

}