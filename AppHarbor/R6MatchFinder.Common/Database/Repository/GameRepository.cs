using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public class GameRepository : IOwnedAsyncRepository<Game>
    {
        private IDbContext _dbContext;

        public GameRepository(IDbContext context)
        {
            _dbContext = context;
        }

        public async Task<Game> CreateAsync(Game dbModel)
        {
            dbModel = _dbContext.Games.Add(dbModel);

            await _dbContext.SaveChangesAsync();

            return dbModel;
        }

        public async Task DeleteAsync(Game dbModel)
        {
            _dbContext.Games.Remove(dbModel);

            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Game>> GetAllAsync()
        {
            return await _dbContext.Games
                .Where(g => g.Date >= DateTimeOffset.UtcNow)
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings).ToListAsync();
        }

        public async Task<Game> GetAsync(Guid id)
        {
            return await _dbContext.Games
                .Where(g => g.Date >= DateTimeOffset.UtcNow)
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<IEnumerable<Game>> GetForUserAsync(string userId)
        {
            return await _dbContext.Games
                .Where(g => g.Date >= DateTimeOffset.UtcNow)
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .Where(g => g.UserId == userId)
                .ToListAsync();
        }

        public IQueryable<Game> GetQueryable()
        {
            return _dbContext.Games;
        }

        public async Task<Game> UpdateAsync(Guid id, Game dbModel)
        {
            dbModel.Id = id;
            _dbContext.Entry(dbModel).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }
    }
}
