namespace R6MatchFinder.Common.Web.Model.Abstract
{
    public abstract class WMBaseGameMatchSettings
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

    }
}
