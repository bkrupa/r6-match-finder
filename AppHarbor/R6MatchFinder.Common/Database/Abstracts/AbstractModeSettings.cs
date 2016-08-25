using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Abstracts
{
    public abstract class AbstractModeSettings
    {
        [Required, Key, ForeignKey("Game")]
        public Guid Id { get; set; }

        [Required, Range(15, 120)]
        public int PreparationPhaseDuration { get; set; }

        [Required, Range(60, 600)]
        public int ActionPhaseDuration { get; set; }

        public bool HostageDeath { get; set; }

        [Range(5, 60)]
        public int SecureTimeLimit { get; set; }

        [Range(5, 60)]
        public int UnsecureTimeLimit { get; set; }

        [Range(5, 15)]
        public int PlantDuration { get; set; }

        [Range(5, 15)]
        public int DefuseDuration { get; set; }

        [Range(15, 90)]
        public int FuseTime { get; set; }

        public bool DefuserCarrierSelection { get; set; }
    }

    public abstract class AbstractModeSettings<T> : AbstractModeSettings
        where T : AbstractGame
    {
        public virtual T Game { get; set; }
    }
}
