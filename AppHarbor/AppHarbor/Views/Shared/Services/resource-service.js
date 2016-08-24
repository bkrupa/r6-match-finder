var app;
(function (app) {
    var ResourceService = (function () {
        function ResourceService(utilityRepository, $q) {
            this.utilityRepository = utilityRepository;
            this.$q = $q;
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
            return '\xa0';
        };
        ResourceService.prototype.load = function (value) {
            var deferred = this.$q.defer();
            this.resolve(value, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        };
        ResourceService.Injection = '$resources';
        ResourceService.$inject = [
            app.UtilityRepository.Injection,
            '$q'
        ];
        return ResourceService;
    }());
    app.ResourceService = ResourceService;
    angular
        .module('app')
        .factory(ResourceService.Injection, app.Activator.CreateFactory(ResourceService));
})(app || (app = {}));
