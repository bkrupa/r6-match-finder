using R6MatchFinder.Common.Database.Abstracts;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGameMatchSettings : AbstractMatchSettings, IWebModel<GameMatchSettings>
    {

        public static WMGameMatchSettings DefaultSettings
        {
            get
            {
                return new WMGameMatchSettings
                {
                    NumberOfRounds = 4,
                    RoleSwap = 1,
                    OvertimeRounds = 1,
                    OvertimeScoreDifference = 2,
                    OvertimeRoleChange = 1,
                    ObjectiveRotationParameter = null,
                    AttackerUniqueSpawn = false,
                    DamageHandicap = 100,
                    FriendlyFireDamage = 100,
                    InjuredHealth = 20,
                    Sprint = true,
                    Lean = true,
                    DeathReplay = true
                };
            }
        }

        public static WMGameMatchSettings Ranked
        {
            get
            {
                return new WMGameMatchSettings
                {
                    NumberOfRounds = 6,
                    RoleSwap = 1,
                    OvertimeRounds = 3,
                    OvertimeScoreDifference = 2,
                    OvertimeRoleChange = 1,
                    ObjectiveRotationParameter = 2,
                    AttackerUniqueSpawn = true,
                    DamageHandicap = 100,
                    FriendlyFireDamage = 100,
                    InjuredHealth = 20,
                    Sprint = true,
                    Lean = true,
                    DeathReplay = true
                };
            }
        }

        public static WMGameMatchSettings ESL
        {
            get
            {
                return new WMGameMatchSettings
                {
                    NumberOfRounds = 8,
                    RoleSwap = 1,
                    OvertimeRounds = 3,
                    OvertimeScoreDifference = 2,
                    OvertimeRoleChange = 1,
                    ObjectiveRotationParameter = 1,
                    AttackerUniqueSpawn = true,
                    DamageHandicap = 100,
                    FriendlyFireDamage = 100,
                    InjuredHealth = 20,
                    Sprint = true,
                    Lean = true,
                    DeathReplay = true
                };
            }
        }
    }
}
