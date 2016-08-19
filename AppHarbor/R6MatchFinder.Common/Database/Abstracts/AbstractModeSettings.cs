using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Abstracts
{
    public abstract class AbstractModeSettings
    {
        [Required, Key, ForeignKey("Game")]
        public Guid Id { get; set; }
    }

    public abstract class AbstractModeSettings<T> : AbstractModeSettings
        where T : AbstractGame
    {
        public virtual T Game { get; set; }
    }
}
