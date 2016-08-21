var app;
(function (app) {
    function StartFromFilter() {
        return function (input, start) {
            if (!input)
                return [];
            start = +start;
            return input.slice(start);
        };
    }
    app.StartFromFilter = StartFromFilter;
    angular
        .module('app')
        .filter('startFrom', StartFromFilter);
})(app || (app = {}));
