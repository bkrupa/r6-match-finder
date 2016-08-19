using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGameModeSettings : IWebModel<GameModeSettings>, IWebModel<ActiveGameModeSettings>
    {
        public string Id { get; set; }
    }
}
