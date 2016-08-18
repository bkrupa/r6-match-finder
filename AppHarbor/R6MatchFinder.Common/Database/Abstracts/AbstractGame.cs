using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Abstracts
{
    public abstract class AbstractGame
    {
        public AbstractGame()
        {
            Id = Guid.NewGuid();
        }


        [Key, Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public User Creator { get; set; }

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

        [Required, Range(3, 5)]
        public int PlayersPerTeam { get; set; }


    }

    public abstract class AbstractGame<T, G> : AbstractGame
        where T : AbstractMatchSettings
        where G : AbstractModeSettings
    {
        public virtual T MatchSettings { get; set; }
        public virtual G ModeSettings { get; set; }
    }
}
