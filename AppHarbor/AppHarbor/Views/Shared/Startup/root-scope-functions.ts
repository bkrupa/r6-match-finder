module app {
    export class RootScopeFunctionsConfig {
        static $inject = [
            '$rootScope',
            ResourceService.Injection
        ];

        constructor(
            $rootScope: any,
            resourceService: ResourceService
        ) {
            $rootScope.resolve = (value: string): string => {
                return resourceService.resolve(value, undefined);
            };

            $rootScope.range = (count: number, start: number): Array<number> => {
                return Utilities.Range(count, start);
            };
        }
    }

    angular
        .module('app')
        .run(RootScopeFunctionsConfig);

}