using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("Games")]
    public class Game
    {
        public Game()
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
        public DateTime Date { get; set; }
    }
}
