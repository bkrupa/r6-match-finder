using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("Maps")]
    public class Map
    {
        [Key, Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; }
    }
}
