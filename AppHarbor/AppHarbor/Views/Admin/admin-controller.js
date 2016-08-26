var app;
(function (app) {
    var AdminController = (function () {
        function AdminController($http, $timeout) {
            this.$http = $http;
            this.$timeout = $timeout;
            this.users = [];
            this.adminUsers = [];
            this.users.$resolved = true;
            this.bindAdminUsers();
        }
        AdminController.prototype.updateUsers = function () {
            var _this = this;
            this.$timeout.cancel(this.lookupTimeout);
            this.users = [];
            this.users.$resolved = false;
            this.lookupTimeout = this.$timeout(function () {
                _this.$http.get('/api/Admin/Users?email=' + _this.email).then(function (response) {
                    _this.users = response.data;
                }).finally(function () {
                    _this.users.$resolved = true;
                });
            }, 1000);
        };
        AdminController.prototype.bindAdminUsers = function () {
            var _this = this;
            this.adminUsers = [];
            this.adminUsers.$resolved = false;
            this.$http.get('/api/Admin/Users/Admin').then(function (response) {
                _this.adminUsers = response.data;
            }).finally(function () {
                _this.adminUsers.$resolved = true;
            });
        };
        AdminController.prototype.addUserToAdmin = function (user) {
            var _this = this;
            this.$http.post('/api/Admin/Users/' + user.id + '/GrantAdmin', {}).then(function () {
                toastr.success('Success');
                _this.bindAdminUsers();
                _this.updateUsers();
            });
        };
        AdminController.prototype.removeUserFromAdmin = function (user) {
            var _this = this;
            this.$http.post('/api/Admin/Users/' + user.id + '/RevokeAdmin', {}).then(function () {
                toastr.success('Success');
            }).finally(function () {
                _this.bindAdminUsers();
            });
        };
        AdminController.Injection = 'adminController';
        AdminController.$inject = ['$http', '$timeout'];
        return AdminController;
    }());
    app.AdminController = AdminController;
    angular
        .module('app')
        .controller(AdminController.Injection, AdminController);
})(app || (app = {}));
