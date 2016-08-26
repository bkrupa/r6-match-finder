using Microsoft.AspNet.Identity.EntityFramework;
using R6MatchFinder.Common.Database.Model;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database
{
    public interface IDbContext
    {
        DbSet<Game> Games { get; }
        DbSet<ActiveGame> ActiveGames { get; }
        DbSet<CompleteGame> CompleteGames { get; set; }
        DbSet<ExceptionLog> Exceptions { get; }
        DbSet<LoginLog> LoginLog { get; }
        DbSet<GameMatchSettings> MatchSettings { get; }
        DbSet<GameModeSettings> ModeSettings { get; }
        DbSet<UserStatistics> UserStatistics { get; }
        DbSet<UserAccounts> UserAccounts { get; }
        DbSet<GameChat> GameChat { get; }
        DbSet<Map> Maps { get; }

        IDbSet<User> Users { get; }
        IDbSet<IdentityRole> Roles { get; }

        DbSet<Log> Log { get; set; }

        Task<int> SaveChangesAsync();
        DbEntityEntry Entry(object entity);
    }
}
