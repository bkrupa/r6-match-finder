module app {

    export function ReplaceFilter() {
        return (input, find, replace) => {
            return input.replace(new RegExp(find, 'g'), replace || '');
        };
    }

    angular
        .module('app')
        .filter('replace', ReplaceFilter);

}