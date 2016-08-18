module app {

    export function StartFromFilter() {
        return (input, start) => {
            if (!input) return [];
            start = +start;
            return input.slice(start);
        };
    }

    angular
        .module('app')
        .filter('startFrom', StartFromFilter);
}