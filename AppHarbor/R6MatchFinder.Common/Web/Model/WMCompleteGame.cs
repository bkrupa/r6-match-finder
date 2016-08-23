using Microsoft.AspNet.Identity;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model.Abstract;
using System.Web;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMCompleteGame : WMGameBase, IWebModel<CompleteGame>, OnModelCreated<WMCompleteGame, CompleteGame>
    {
        public bool IsComplete { get { return true; } }

        public bool CanRate { get; private set; }

        public WMUser Challenger { get; set; }
        public string ChallengerId { get; set; }


        public WMCompleteGameMatchSettings MatchSettings { get; set; }
        public WMCompleteGameModeSettings ModeSettings { get; set; }

        public void OnModelCreated(WMCompleteGame webModel, CompleteGame dbModel)
        {
            string currentUserId = HttpContext.Current.User.Identity.GetUserId();

            webModel.CanRate = (currentUserId == dbModel.UserId && !dbModel.CreatorRating.HasValue) ||
                (currentUserId == dbModel.ChallengerId && !dbModel.ChallengerRating.HasValue);
        }
    }
}
