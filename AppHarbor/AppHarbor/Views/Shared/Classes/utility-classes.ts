module app {

    export class Utilities {
        public static Range(count: number, start: number): Array<number> {
            start = start || 0;

            if (!count || count <= 0)
                return [];

            var ar = [];
            for (var i = start; i < count + start; i++)
                ar.push(i);

            return ar;
        }
    }
}