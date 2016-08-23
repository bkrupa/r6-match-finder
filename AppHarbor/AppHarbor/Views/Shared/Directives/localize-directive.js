var app;
(function (app) {
    var LocalizeDirective = (function () {
        function LocalizeDirective($resources) {
            this.$resources = $resources;
            this.restrict = 'A';
            this.replace = false;
            this.template = '<span>{{text}}</span>';
            this.scope = {
                resourceName: '@localize'
            };
        }
        LocalizeDirective.prototype.link = function (scope, elem, attrs) {
            this.$resources.resolve(scope.resourceName, function (value) {
                scope.text = value;
            });
        };
        LocalizeDirective.Injection = 'localize';
        LocalizeDirective.$inject = [
            '$resources'
        ];
        return LocalizeDirective;
    }());
    app.LocalizeDirective = LocalizeDirective;
    angular
        .module('app')
        .directive(LocalizeDirective.Injection, app.Activator.CreateFactory(LocalizeDirective));
})(app || (app = {}));
