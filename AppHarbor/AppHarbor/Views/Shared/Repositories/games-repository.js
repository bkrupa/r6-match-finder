var app;
(function (app) {
    var GamesRepository = (function () {
        function GamesRepository($resource) {
            var that = this;
            this.gamesResource = $resource('/api/Games/:id/:action', { action: '@action', id: '@id' });
            this.gamesResource.prototype.$join = function () {
                return that.gamesResource.save({
                    action: 'Join',
                    id: this.id
                });
            };
        }
        GamesRepository.prototype.getAll = function () {
            return this.gamesResource.query();
        };
        GamesRepository.prototype.get = function (id) {
            return this.gamesResource.get({
                id: id
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
        .factory(GamesRepository.Injection, ['$resource', function ($resource) { return new GamesRepository($resource); }]);
})(app || (app = {}));
//# sourceMappingURL=games-repository.js.map