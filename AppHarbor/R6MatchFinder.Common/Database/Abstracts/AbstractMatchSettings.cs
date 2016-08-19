using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Abstracts
{
    public abstract class AbstractMatchSettings

    {
        [Required, Key, ForeignKey("Game")]
        public Guid Id { get; set; }

        /**  Match Settings **/
        [Required]
        public int NumberOfRounds { get; set; }
        [Required]
        public int RoleSwap { get; set; }
        [Required]
        public int OvertimeRounds { get; set; }
        [Required]
        public int OvertimeScoreDifference { get; set; }
        [Required]
        public int OvertimeRoleChange { get; set; }
        public int? ObjectiveRotationParameter { get; set; }
        [Required]
        public bool AttackerUniqueSpawn { get; set; }
        [Required]
        public int DamageHandicap { get; set; }
        [Required]
        public int FriendlyFireDamage { get; set; }
        [Required]
        public int InjuredHealth { get; set; }
        [Required]
        public bool Sprint { get; set; }
        [Required]
        public bool Lean { get; set; }
        [Required]
        public bool DeathReplay { get; set; }
    }

    public abstract class AbstractMatchSettings<T> : AbstractMatchSettings
        where T : AbstractGame
    {
        public virtual T Game { get; set; }
    }
}
