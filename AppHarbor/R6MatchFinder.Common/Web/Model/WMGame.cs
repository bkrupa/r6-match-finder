using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model.Abstract;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGame : WMGameBase, IWebModel<Game>
    {
        public WMBaseGameMatchSettings MatchSettings { get; set; }
        public WMBaseGameModeSettings ModeSettings { get; set; }

    }
}
