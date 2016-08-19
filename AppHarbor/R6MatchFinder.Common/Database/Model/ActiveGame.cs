using System.ComponentModel.DataAnnotations.Schema;
using R6MatchFinder.Common.Database.Abstracts;
using AutoMapper;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("ActiveGames")]
    public class ActiveGame : AbstractGame<ActiveGameMatchSettings, ActiveGameModeSettings>
    {
        [ForeignKey("Challenger")]
        public string ChallengerId { get; set; }

        public virtual User Challenger { get; set; }

        public static ActiveGame FromGame(Game orig)
        {
            return Mapper.Map<Game, ActiveGame>(orig);
        }
    }
}
