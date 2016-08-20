using R6MatchFinder.Common.Utility;
using System;

namespace R6MatchFinder.Common.Web.Model.Abstract
{
    public abstract class WMGameBase
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTimeOffset Date { get; set; }

        public RuleSet Rules { get; set; }

        public TimeOfDay Time { get; set; }
        public HudSettings Hud { get; set; }
        public GameMode Mode { get; set; }
        public Platform Platform { get; set; }

        public int PlayersPerTeam { get; set; }

        public WMUser Creator { get; set; }
    }
}
