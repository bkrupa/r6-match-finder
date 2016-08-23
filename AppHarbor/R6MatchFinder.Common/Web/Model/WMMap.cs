using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMMap : IWebModel<Map>
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
