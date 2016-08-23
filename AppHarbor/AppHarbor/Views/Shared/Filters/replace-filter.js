var app;
(function (app) {
    function ReplaceFilter() {
        return function (input, find, replace) {
            return input.replace(new RegExp(find, 'g'), replace || '');
        };
    }
    app.ReplaceFilter = ReplaceFilter;
    angular
        .module('app')
        .filter('replace', ReplaceFilter);
})(app || (app = {}));
