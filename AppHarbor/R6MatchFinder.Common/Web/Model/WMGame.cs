using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model.Abstract;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGame : WMGameBase, IWebModel<Game>
    {
        public bool IsOpen { get { return true; } }


        public WMGameMatchSettings MatchSettings { get; set; }
        public WMGameModeSettings ModeSettings { get; set; }

    }
}
