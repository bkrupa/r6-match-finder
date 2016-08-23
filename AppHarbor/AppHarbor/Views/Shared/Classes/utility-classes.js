var app;
(function (app) {
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.Range = function (count, start) {
            start = start || 0;
            if (!count || count <= 0)
                return [];
            var ar = [];
            for (var i = start; i < count + start; i++)
                ar.push(i);
            return ar;
        };
        return Utilities;
    }());
    app.Utilities = Utilities;
})(app || (app = {}));
//# sourceMappingURL=utility-classes.js.map