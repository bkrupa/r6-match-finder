var app;
(function (app) {
    var EnumsConfiguration = (function () {
        function EnumsConfiguration(utilityRepository) {
            utilityRepository.bindEnums();
        }
        EnumsConfiguration.$inject = [
            app.UtilityRepository.Injection
        ];
        return EnumsConfiguration;
    }());
    angular
        .module('app')
        .constant('Enums', {})
        .run(EnumsConfiguration);
})(app || (app = {}));
//# sourceMappingURL=enums-constant.js.map