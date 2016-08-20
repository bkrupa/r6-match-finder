using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model.Abstract;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMActiveGame : WMGameBase, IWebModel<ActiveGame>
    {
        public bool IsActive { get { return true; } }

        public WMUser Challenger { get; set; }
        public string ChallengerId { get; set; }
    }
}
