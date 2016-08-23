using AutoMapper;
using R6MatchFinder.Common.Database.Abstracts;
using R6MatchFinder.Common.Database.Interfaces;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("CompleteGames")]
    public class CompleteGame : AbstractGame<CompleteGameMatchSettings, CompleteGameModeSettings>, IValidateEntity
    {
        [ForeignKey("UserId")]
        public User Creator { get; set; }

        [ForeignKey("Challenger")]
        public string ChallengerId { get; set; }

        public virtual User Challenger { get; set; }

        [Range(1, 5)]
        public int? CreatorRating { get; set; }

        [Range(1, 5)]
        public int? ChallengerRating { get; set; }

        public ICollection<GameChat> ChatHistory { get; set; }

        public static CompleteGame FromActiveGame(ActiveGame orig)
        {
            return Mapper.Map<ActiveGame, CompleteGame>(orig);
        }

        public IEnumerable<DbValidationError> Validate(DbEntityEntry entityEntry)
        {
            CompleteGame dbModel = entityEntry.Entity as CompleteGame;

            if (!dbModel.ChallengerRating.HasValue && !dbModel.CreatorRating.HasValue)
                yield return new DbValidationError("ChallengerRating,CreatorRating", "ChallengerRating or CreaterRating must be supplied");



        }
    }
}
