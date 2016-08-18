module app {

    export class AccountRepository {
        static Injection: string = 'accountRepository';
        static $inject = [
            '$resource'
        ];

        private resource: ng.resource.IResourceClass<any>;

        constructor($resource: ng.resource.IResourceService) {
            this.resource = $resource('/api/Users');
        }

        public getCurrentUserInfo(): Array<any> {
            return this.resource.get();
        }
    }

    angular
        .module('app')
        .factory(AccountRepository.Injection, ['$resource', ($resource) => { return new AccountRepository($resource); }]);

}