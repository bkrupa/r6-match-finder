var app;
(function (app) {
    function ResourceToArrayFilter() {
        return function (obj) {
            return $.map(obj, function (value, index) {
                return isNaN(parseInt(index)) ? [] : [value];
            });
        };
    }
    app.ResourceToArrayFilter = ResourceToArrayFilter;
    angular
        .module('app')
        .filter('resourceToArray', ResourceToArrayFilter);
})(app || (app = {}));
