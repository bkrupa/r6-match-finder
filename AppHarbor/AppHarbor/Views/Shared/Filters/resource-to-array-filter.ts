module app {

    export function ResourceToArrayFilter() {
        return (obj) => {
            return $.map(obj, (value, index) => {
                return isNaN(parseInt(index)) ? [] : [value];
            });
        };
    }

    angular
        .module('app')
        .filter('resourceToArray', ResourceToArrayFilter);
}