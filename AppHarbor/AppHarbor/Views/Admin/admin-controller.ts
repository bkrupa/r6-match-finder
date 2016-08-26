module app {

    export class AdminController {
        static Injection: string = 'adminController';
        static $inject = ['$http', '$timeout'];

        public users: Array<any> = [];
        public adminUsers: Array<any> = [];
        public email: string;

        constructor(
            private $http: ng.IHttpService,
            private $timeout: ng.ITimeoutService
        ) {
            this.users.$resolved = true;
            this.bindAdminUsers();
        }

        private lookupTimeout: ng.IPromise<any>;
        public updateUsers() {
            this.$timeout.cancel(this.lookupTimeout);
            this.users = [];
            this.users.$resolved = false;

            this.lookupTimeout = this.$timeout(() => {
                this.$http.get('/api/Admin/Users?email=' + this.email).then((response) => {
                    this.users = <any[]>response.data;
                }).finally(() => {
                    this.users.$resolved = true;
                });

            }, 1000);
        }

        public bindAdminUsers() {
            this.adminUsers = [];
            this.adminUsers.$resolved = false;
            this.$http.get('/api/Admin/Users/Admin').then((response) => {
                this.adminUsers = <any[]>response.data;
            }).finally(() => {
                this.adminUsers.$resolved = true;
            });
        }

        public addUserToAdmin(user) {
            this.$http.post('/api/Admin/Users/' + user.id + '/GrantAdmin', {}).then(() => {
                toastr.success('Success');
                this.bindAdminUsers();
                this.updateUsers();
            });
        }

        public removeUserFromAdmin(user) {
            this.$http.post('/api/Admin/Users/' + user.id + '/RevokeAdmin', {}).then(() => {
                toastr.success('Success');
            }).finally(() => {
                this.bindAdminUsers();
            });
        }
    }

    angular
        .module('app')
        .controller(AdminController.Injection, AdminController);
}