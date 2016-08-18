using R6MatchFinder.Common.Database.Model;
using System.Data.Entity;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database
{
    public interface IDbContext
    {
        DbSet<Game> Games { get; }
        DbSet<ActiveGame> ActiveGames { get; }
        DbSet<ExceptionLog> Exceptions { get; }
        DbSet<LoginLog> LoginLog { get; }
        DbSet<GameMatchSettings> MatchSettings { get; }
        DbSet<GameModeSettings> ModeSettings { get; }
        DbSet<UserStatistics> UserStatistics { get; }

        Task<int> SaveChangesAsync();
    }
}
