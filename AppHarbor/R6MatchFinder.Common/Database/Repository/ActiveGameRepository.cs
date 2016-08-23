using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public class ActiveGameRepository : IOwnedAsyncRepository<ActiveGame>
    {
        private IDbContext _dbContext;

        public ActiveGameRepository(IDbContext context)
        {
            _dbContext = context;
        }

        public async Task<ActiveGame> CreateAsync(ActiveGame dbModel)
        {
            dbModel = _dbContext.ActiveGames.Add(dbModel);

            await _dbContext.SaveChangesAsync();

            return dbModel;
        }

        public async Task DeleteAsync(ActiveGame dbModel)
        {
            _dbContext.ActiveGames.Remove(dbModel);

            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<ActiveGame>> GetAllAsync()
        {
            return await _dbContext.ActiveGames
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .Include(g => g.Challenger)
                .Include(g => g.Creator)
                .Include(g => g.Map)
                .Include(g => g.ChatHistory)
                .ToListAsync();
        }

        public async Task<ActiveGame> GetAsync(Guid id)
        {
            return await _dbContext.ActiveGames
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .Include(g => g.Challenger)
                .Include(g => g.Creator)
                .Include(g => g.Map)
                .Include(g => g.ChatHistory)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<IEnumerable<ActiveGame>> GetForUserAsync(string userId)
        {
            return await _dbContext.ActiveGames
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .Include(g => g.Challenger)
                .Include(g => g.Creator)
                .Include(g => g.Map)
                .Include(g => g.ChatHistory)
                .Where(g => g.UserId == userId || g.ChallengerId == userId)
                .ToListAsync();
        }

        public IQueryable<ActiveGame> GetQueryable()
        {
            return _dbContext.ActiveGames;
        }

        public async Task<ActiveGame> UpdateAsync(Guid id, ActiveGame dbModel)
        {
            dbModel.Id = id;
            _dbContext.Entry(dbModel).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }
    }
}
