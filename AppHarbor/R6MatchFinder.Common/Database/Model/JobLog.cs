using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("JobLog")]
    public class JobLog
    {
        public JobLog()
        {
            Date = DateTimeOffset.UtcNow;
        }

        [Key, Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required, MaxLength(255)]
        public string Message { get; set; }

        [Required]
        public DateTimeOffset Date { get; set; }

        public string Job { get; set; }
    }
}
