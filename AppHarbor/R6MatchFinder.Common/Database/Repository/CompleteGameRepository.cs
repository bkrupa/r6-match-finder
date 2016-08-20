using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public class CompleteGameRepository : IOwnedAsyncRepository<CompleteGame>
    {
        private IDbContext _dbContext;

        public CompleteGameRepository(IDbContext context)
        {
            _dbContext = context;
        }

        public async Task<CompleteGame> CreateAsync(CompleteGame dbModel)
        {
            dbModel = _dbContext.CompleteGames.Add(dbModel);

            await _dbContext.SaveChangesAsync();

            return dbModel;
        }

        public async Task DeleteAsync(CompleteGame dbModel)
        {
            _dbContext.CompleteGames.Remove(dbModel);

            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<CompleteGame>> GetAllAsync()
        {
            return await _dbContext.CompleteGames
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .Include(g => g.Challenger)
                .Include(g => g.Creator)
                .ToListAsync();
        }

        public async Task<CompleteGame> GetAsync(Guid id)
        {
            return await _dbContext.CompleteGames
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .Include(g => g.Challenger)
                .Include(g => g.Creator)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<IEnumerable<CompleteGame>> GetForUserAsync(string userId)
        {
            return await _dbContext.CompleteGames
                .Include(g => g.MatchSettings)
                .Include(g => g.ModeSettings)
                .Include(g => g.Challenger)
                .Include(g => g.Creator)
                .Where(g => g.UserId == userId || g.ChallengerId == userId)
                .ToListAsync();
        }

        public IQueryable<CompleteGame> GetQueryable()
        {
            return _dbContext.CompleteGames;
        }

        public async Task<CompleteGame> UpdateAsync(Guid id, CompleteGame dbModel)
        {
            dbModel.Id = id;
            _dbContext.Entry(dbModel).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }
    }
}
