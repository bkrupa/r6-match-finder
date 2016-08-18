using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("UserStatistics")]
    public class UserStatistics
    {
        [Key, Required, ForeignKey("User")]
        public string Id { get; set; }

        public virtual User User { get; set; }
    }
}
