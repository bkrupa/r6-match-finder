var app;
(function (app) {
    var CurrentUserConfig = (function () {
        function CurrentUserConfig($rootScope, accountRepository) {
            this.$rootScope = $rootScope;
            this.accountRepository = accountRepository;
            $rootScope.userInfo = accountRepository.getCurrentUserInfo();
        }
        CurrentUserConfig.$Inject = [
            '$rootScope',
            app.AccountRepository.Injection
        ];
        return CurrentUserConfig;
    }());
    angular
        .module('app')
        .run(CurrentUserConfig);
})(app || (app = {}));
//# sourceMappingURL=current-user.js.map