using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;

namespace R6MatchFinder.Common.Web.Model.Abstract
{
    public class WMBaseGameMatchSettings : IWebModel<GameMatchSettings>, IWebModel<ActiveGameMatchSettings>, IWebModel<CompleteGameMatchSettings>
    {
        public string Id { get; set; }

        public int NumberOfRounds { get; set; }
        public int RoleSwap { get; set; }
        public int OvertimeRounds { get; set; }
        public int OvertimeScoreDifference { get; set; }
        public int OvertimeRoleChange { get; set; }
        public int? ObjectiveRotationParameter { get; set; }
        public bool AttackerUniqueSpawn { get; set; }
        public int DamageHandicap { get; set; }
        public int FriendlyFireDamage { get; set; }
        public int InjuredHealth { get; set; }
        public bool Sprint { get; set; }
        public bool Lean { get; set; }
        public bool DeathReplay { get; set; }

        public static WMBaseGameMatchSettings DefaultSettings
        {
            get
            {
                return new WMBaseGameMatchSettings
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

        public static WMBaseGameMatchSettings Ranked
        {
            get
            {
                return new WMBaseGameMatchSettings
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

        public static WMBaseGameMatchSettings ESL
        {
            get
            {
                return new WMBaseGameMatchSettings
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
