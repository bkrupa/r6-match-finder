module app {

    class EnumsConfiguration {
        static $inject = [
            UtilityRepository.Injection
        ];

        constructor(
            utilityRepository: UtilityRepository
        ) {
            utilityRepository.bindEnums();
        }
    }

    angular
        .module('app')
        .constant('Enums', {})
        .run(EnumsConfiguration);

}