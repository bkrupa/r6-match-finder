module app {

    class CurrentUserConfig {
        static $Inject = [
            '$rootScope',
            AccountRepository.Injection
        ];

        constructor(
            private $rootScope: any,
            private accountRepository: AccountRepository
        ) {
            $rootScope.userInfo = accountRepository.getCurrentUserInfo();
        }

    }


    angular
        .module('app')
        .run(CurrentUserConfig);

}