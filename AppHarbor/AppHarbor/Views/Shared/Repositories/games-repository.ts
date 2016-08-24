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
        map: any;
        isActive: boolean;
        isComplete: boolean;

        $join(): void;
    }


    export class GamesRepository {
        static Injection: string = 'gamesRepository';
        static $inject = [
            '$resource'
        ];

        public gamesResource: ng.resource.IResourceClass<any>;

        constructor($resource: ng.resource.IResourceService) {
            var that: GamesRepository = this;
            this.gamesResource = $resource('/api/Games/:group/:id/:action', { action: '@action', id: '@id' });

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

        public getAll(): ng.resource.IResourceArray<IGameResource> {
            return this.gamesResource.query();
        }

        public getOpenGame(id: string): IGameResource {
            return this.gamesResource.get({
                id: id
            });
        }

        public getActiveGames(): ng.resource.IResourceArray<IGameResource> {
            return this.gamesResource.query({
                group: 'Active'
            });
        }

        public getActiveGame(id: string): IGameResource {
            return this.gamesResource.get({
                id: id,
                group: 'Active'
            });
        }

        public getCompleteGame(id: string): IGameResource {
            return this.gamesResource.get({
                id: id,
                group: 'Complete'
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
        .factory(GamesRepository.Injection, Activator.CreateFactory(GamesRepository));

}