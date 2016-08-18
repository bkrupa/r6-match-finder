var app;
(function (app) {
    var ResourceService = (function () {
        function ResourceService(utilityRepository) {
            this.utilityRepository = utilityRepository;
            this.resources = {};
        }
        ResourceService.prototype.resolve = function (value, callback) {
            if (this.resources.hasOwnProperty(value)) {
                if (callback)
                    callback(this.resources[value]);
                return this.resources[value];
            }
            var that = this;
            this.utilityRepository.getResource(value).then(function (response) {
                that.resources[value] = response || value;
                if (callback)
                    callback(response);
            });
            return this.resources[value] = '';
        };
        ResourceService.prototype.load = function (value, callback) {
            return this.resolve(value, callback);
        };
        ResourceService.factory = function () {
            var repo = function (utilityRepository) { return new ResourceService(utilityRepository); };
            repo.$inject = ResourceService.$inject;
            return repo;
        };
        ResourceService.Injection = '$resources';
        ResourceService.$inject = [
            app.UtilityRepository.Injection
        ];
        return ResourceService;
    }());
    app.ResourceService = ResourceService;
    angular
        .module('app')
        .factory(ResourceService.Injection, ResourceService.factory());
})(app || (app = {}));
