using System.ComponentModel.DataAnnotations.Schema;
using R6MatchFinder.Common.Database.Abstracts;
using AutoMapper;
using R6MatchFinder.Common.Database.Interfaces;
using System.Collections.Generic;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("ActiveGames")]
    public class ActiveGame : AbstractGame<ActiveGameMatchSettings, ActiveGameModeSettings>, MapTo<CompleteGame>
    {
        [ForeignKey("UserId")]
        public User Creator { get; set; }

        [ForeignKey("Challenger")]
        public string ChallengerId { get; set; }

        public virtual User Challenger { get; set; }

        public ICollection<GameChat> ChatHistory { get; set; }

        public static ActiveGame FromGame(Game orig)
        {
            return Mapper.Map<Game, ActiveGame>(orig);
        }
    }
}
