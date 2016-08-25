using R6MatchFinder.Common.Database.Abstracts;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGameModeSettings : AbstractModeSettings, IWebModel<GameModeSettings>
    {

        public static WMGameModeSettings DefaultSettings
        {
            get
            {
                return new WMGameModeSettings
                {
                    PreparationPhaseDuration = 45,
                    ActionPhaseDuration = 180,
                    HostageDeath = true,
                    SecureTimeLimit = 15,
                    UnsecureTimeLimit = 15,
                    PlantDuration = 7,
                    DefuseDuration = 7,
                    FuseTime = 45,
                    DefuserCarrierSelection = true
                };
            }
        }
    }
}
