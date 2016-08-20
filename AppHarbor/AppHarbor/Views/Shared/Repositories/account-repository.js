var app;
(function (app) {
    var AccountRepository = (function () {
        function AccountRepository($resource) {
            this.resource = $resource('/api/Users/:id/:action');
        }
        AccountRepository.prototype.getCurrentUserInfo = function () {
            return this.resource.get();
        };
        AccountRepository.prototype.getUserStatistics = function (id) {
            return this.resource.get({
                id: id,
                action: 'Statistics'
            });
        };
        AccountRepository.Injection = 'accountRepository';
        AccountRepository.$inject = [
            '$resource'
        ];
        return AccountRepository;
    }());
    app.AccountRepository = AccountRepository;
    angular
        .module('app')
        .factory(AccountRepository.Injection, ['$resource', function ($resource) { return new AccountRepository($resource); }]);
})(app || (app = {}));
//# sourceMappingURL=account-repository.js.map