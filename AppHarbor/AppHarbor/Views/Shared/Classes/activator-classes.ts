module app {

    export class Activator {
        static CreateFactory(type: Function) {
            var instance = (...args: any[]) => {
                return new (type.bind.apply(type, [null].concat(args)));
            }
            instance.$inject = type.$inject;
            return instance;
        }
    }
}