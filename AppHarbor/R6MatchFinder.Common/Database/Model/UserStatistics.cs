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

        [Required, Range(0, int.MaxValue)]
        public int GamesCreated { get; set; }
        [Required, Range(0, int.MaxValue)]
        public int GamesPlayed { get; set; }

        [Required, Range(0, int.MaxValue)]
        public int ChallengesAccepted { get; set; }

    }
}
