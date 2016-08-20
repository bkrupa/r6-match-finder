using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;

namespace R6MatchFinder.Common.Web.Model.Abstract
{
    public class WMBaseGameModeSettings : IWebModel<GameModeSettings>, IWebModel<ActiveGameModeSettings>, IWebModel<CompleteGameModeSettings>
    {
        public string Id { get; set; }
    }
}
