using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMUserStatistics : IWebModel<UserStatistics>
    {
        public int GamesCreated { get; set; }
        public int GamesPlayed { get; set; }
        public int GamesAbandoned { get; set; }

        public int ChallengesAccepted { get; set; }

        public int ChallengesTaken { get; set; }
    }
}
