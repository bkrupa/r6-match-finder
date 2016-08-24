var app;
(function (app) {
    var MapsRepository = (function () {
        function MapsRepository($resource, $cacheFactory) {
            var that = this;
            this.resource = $resource('/api/Maps/:id/:action', { action: '@action', id: '@id' });
            this.cache = $cacheFactory(MapsRepository.Injection);
        }
        MapsRepository.prototype.getAll = function () {
            var maps = this.cache.get('maps');
            if (maps)
                return maps;
            maps = this.resource.query();
            this.cache.put('maps', maps);
            return maps;
        };
        MapsRepository.prototype.get = function (id) {
            return this.resource.get({
                id: id
            });
        };
        MapsRepository.prototype.create = function () {
            return this.resource.get({
                action: 'new'
            });
        };
        MapsRepository.Injection = 'mapsRepository';
        MapsRepository.$inject = [
            '$resource',
            '$cacheFactory'
        ];
        return MapsRepository;
    }());
    app.MapsRepository = MapsRepository;
    angular
        .module('app')
        .factory(MapsRepository.Injection, app.Activator.CreateFactory(MapsRepository));
})(app || (app = {}));
//# sourceMappingURL=maps-repository.js.map