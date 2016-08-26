var app;
(function (app) {
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.Range = function (count, start, step) {
            start = start || 0;
            step = step || 1;
            if (!count || count <= 0)
                return [];
            var ar = [];
            for (var i = start; i < (count * step) + start; i += step)
                ar.push(i);
            return ar;
        };
        return Utilities;
    }());
    app.Utilities = Utilities;
})(app || (app = {}));
//# sourceMappingURL=utility-classes.js.map