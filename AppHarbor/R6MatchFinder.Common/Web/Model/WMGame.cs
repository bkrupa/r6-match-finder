using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utility;
using R6MatchFinder.Common.Web.Interfaces;
using System;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGame : IWebModel<Game>
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTimeOffset Date { get; set; }

        public RuleSet Rules { get; set; }

        public TimeOfDay Time { get; set; }
        public HudSettings Hud { get; set; }
        public GameMode Mode { get; set; }

        public int PlayersPerTeam { get; set; }

        public WMGameMatchSettings MatchSettings { get; set; }
        public WMGameModeSettings ModeSettings { get; set; }

        public WMUser User { get; set; }
    }
}
