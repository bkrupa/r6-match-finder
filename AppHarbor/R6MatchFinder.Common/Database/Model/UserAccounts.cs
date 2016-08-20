using R6MatchFinder.Common.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Model
{
    public class UserAccounts
    {
        [Key, Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        public Platform Platform { get; set; }

        [Required, MaxLength(50)]
        public String Account { get; set; }
    }
}
