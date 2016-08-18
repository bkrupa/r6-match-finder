using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("Exceptions")]
    public class ExceptionLog
    {
        public ExceptionLog()
        {
            Id = Guid.NewGuid();
            Date = DateTime.UtcNow;
            Children = new List<ExceptionLog>();
        }

        public DateTime Date { get; private set; }

        public string Message { get; set; }

        public string StackTrace { get; set; }

        [ForeignKey("Parent")]
        public Guid? ParentId { get; set; }
        public virtual ExceptionLog Parent { get; set; }
        [InverseProperty("Parent")]
        public virtual ICollection<ExceptionLog> Children { get; set; }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [ForeignKey("SessionUser")]
        public string UserId { get; set; }
        public User SessionUser { get; set; }
    }
}
