var app;
(function (app) {
    var GamesRepository = (function () {
        function GamesRepository($resource) {
            var that = this;
            this.gamesResource = $resource('/api/Games/:group/:id/:action', { action: '@action', id: '@id' });
            this.gamesResource.prototype.$join = function () {
                return that.gamesResource.save({
                    action: 'Join',
                    id: this.id
                });
            };
            this.gamesResource.prototype.$complete = function (rating) {
                return that.gamesResource.save({
                    action: 'Complete',
                    id: this.id
                }, rating);
            };
            this.gamesResource.prototype.$rate = function (rating) {
                return that.gamesResource.save({
                    action: 'Rate',
                    id: this.id
                }, rating);
            };
        }
        GamesRepository.prototype.getAll = function () {
            return this.gamesResource.query();
        };
        GamesRepository.prototype.getOpenGame = function (id) {
            return this.gamesResource.get({
                id: id
            });
        };
        GamesRepository.prototype.getActiveGames = function () {
            return this.gamesResource.query({
                group: 'Active'
            });
        };
        GamesRepository.prototype.getActiveGame = function (id) {
            return this.gamesResource.get({
                id: id,
                group: 'Active'
            });
        };
        GamesRepository.prototype.getCompleteGame = function (id) {
            return this.gamesResource.get({
                id: id,
                group: 'Complete'
            });
        };
        GamesRepository.prototype.create = function () {
            return this.gamesResource.get({
                action: 'new'
            });
        };
        GamesRepository.prototype.getMyGames = function () {
            return this.gamesResource.query({
                action: 'MyGames'
            });
        };
        GamesRepository.Injection = 'gamesRepository';
        GamesRepository.$inject = [
            '$resource'
        ];
        return GamesRepository;
    }());
    app.GamesRepository = GamesRepository;
    angular
        .module('app')
        .factory(GamesRepository.Injection, app.Activator.CreateFactory(GamesRepository));
})(app || (app = {}));
