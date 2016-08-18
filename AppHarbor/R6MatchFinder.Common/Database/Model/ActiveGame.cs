using R6MatchFinder.Common.Database.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using R6MatchFinder.Common.Utility;
using R6MatchFinder.Common.Database.Abstracts;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("ActiveGames")]
    public class ActiveGame : AbstractGame<ActiveGameMatchSettings, ActiveGameModeSettings>
    {
        [ForeignKey("Challenger")]
        public string ChallengerId { get; set; }

        public virtual User Challenger { get; set; }
    }
}
