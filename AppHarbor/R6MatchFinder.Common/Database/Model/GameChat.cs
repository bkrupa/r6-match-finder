using R6MatchFinder.Common.Database.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("GameChat")]
    public class GameChat : IFluentModel
    {
        public GameChat()
        {
            Date = DateTimeOffset.UtcNow;
        }

        [Key, Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public Guid? ActiveGameId { get; set; }
        public virtual ActiveGame ActiveGame { get; set; }

        public Guid? CompleteGameId { get; set; }
        public virtual CompleteGame CompleteGame { get; set; }

        [Required, ForeignKey("FromUser")]
        public string FromUserId { get; set; }
        public virtual User FromUser { get; set; }

        [Required, MaxLength(255)]
        public string Message { get; set; }

        [Required]
        public DateTimeOffset Date { get; set; }

        public void OnModelCreating(DbModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<GameChat>();

            entity.HasOptional(a => a.ActiveGame)
                .WithMany(a => a.ChatHistory)
                .HasForeignKey(a => a.ActiveGameId)
                .WillCascadeOnDelete(false);

            entity.HasOptional(a => a.CompleteGame)
                .WithMany(a => a.ChatHistory)
                .HasForeignKey(a => a.CompleteGameId)
                .WillCascadeOnDelete(false);
        }
    }
}
