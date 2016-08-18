var app;
(function (app) {
    var GamesRepository = (function () {
        function GamesRepository($resource) {
            this.gamesResource = $resource('/api/Games/:action/:id', { action: '@action', id: '@id' });
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
