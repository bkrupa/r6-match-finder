using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utility;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Abstracts
{
    public abstract class AbstractGame
    {
        public AbstractGame()
        {
            Id = Guid.NewGuid();
            DateCreated = DateTimeOffset.UtcNow;
        }


        [Key, Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTimeOffset Date { get; set; }


        [Required]
        public RuleSet Rules { get; set; }

        /** Game Settings **/
        [Required]
        public TimeOfDay Time { get; set; }
        [Required]
        public HudSettings Hud { get; set; }
        [Required]
        public GameMode Mode { get; set; }

        [Required]
        public Platform Platform { get; set; }

        [Required, Range(3, 5)]
        public int PlayersPerTeam { get; set; }

        [Required]
        public DateTimeOffset DateCreated { get; set; }

        [ForeignKey("Map"), Required]
        public Guid MapId { get; set; }
        public Map Map { get; set; }
    }

    public abstract class AbstractGame<T, G> : AbstractGame
        where T : AbstractMatchSettings
        where G : AbstractModeSettings
    {
        public virtual T MatchSettings { get; set; }
        public virtual G ModeSettings { get; set; }
    }
}
