module app {

    export interface StringStringDictionary {
        [key: string]: string;
    }

    export interface EventDictionary {
        [key: string]: Array<(...args: any[]) => any>;
    }

    export interface ISignalREvents {
        Connecting: string;
        Connected: string;
        Reconnecting: string;
        Disconnected: string;
        Error: string;
    }

    export interface EventedObject {
        $on(event: string, callback: (...args: any[]) => any): void;
    }

    export class Utilities {
        public static Range(count: number, start: number, step?: number): Array<number> {
            start = start || 0;
            step = step || 1;

            if (!count || count <= 0)
                return [];

            var ar = [];
            for (var i = start; i < (count * step) + start; i += step)
                ar.push(i);

            return ar;
        }
    }
}