var app;
(function (app) {
    var MapsRepository = (function () {
        function MapsRepository($resource) {
            var that = this;
            this.resource = $resource('/api/Maps/:id/:action', { action: '@action', id: '@id' });
        }
        MapsRepository.prototype.getAll = function () {
            return this.resource.query();
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
            '$resource'
        ];
        return MapsRepository;
    }());
    app.MapsRepository = MapsRepository;
    angular
        .module('app')
        .factory(MapsRepository.Injection, app.Activator.CreateFactory(MapsRepository));
})(app || (app = {}));
