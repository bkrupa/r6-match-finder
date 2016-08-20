using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("UserStatistics")]
    public class UserStatistics
    {
        [Key, Required, ForeignKey("User")]
        public string Id { get; set; }

        public virtual User User { get; set; }

        /// <summary>
        /// Games that were created
        /// </summary>
        [Required, Range(0, int.MaxValue)]
        public int GamesCreated { get; set; }

        /// <summary>
        /// Games that were completed
        /// </summary>
        [Required, Range(0, int.MaxValue)]
        public int GamesPlayed { get; set; }
        /// <summary>
        /// Games that were created and then deleted
        /// </summary>
        [Required, Range(0, int.MaxValue)]
        public int GamesAbandoned { get; set; }

        /// <summary>
        /// This represents games that were created by the user, that somebody else accepted
        /// </summary>
        [Required, Range(0, int.MaxValue)]
        public int ChallengesAccepted { get; set; }

        /// <summary>
        /// This represents games created by somebody else, where the given user has joined
        /// </summary>
        [Required, Range(0, int.MaxValue)]
        public int ChallengesTaken { get; set; }

        public double AverageRating { get; set; }
    }
}
