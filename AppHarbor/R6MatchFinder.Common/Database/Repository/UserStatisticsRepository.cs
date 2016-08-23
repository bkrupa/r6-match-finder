using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Data.Entity;


namespace R6MatchFinder.Common.Database.Repository
{
    public class UserStatisticsRepository : IAsyncRepository<UserStatistics>
    {
        private IDbContext _dbContext;

        public UserStatisticsRepository(IDbContext context)
        {
            _dbContext = context;
        }

        public async Task<UserStatistics> CreateAsync(UserStatistics dbModel)
        {
            dbModel = _dbContext.UserStatistics.Add(dbModel);
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }

        public async Task DeleteAsync(UserStatistics dbModel)
        {
            _dbContext.UserStatistics.Remove(dbModel);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<UserStatistics>> GetAllAsync()
        {
            return await _dbContext.UserStatistics
                .Include(g => g.User)
                .ToListAsync();
        }

        public async Task<UserStatistics> GetAsync(Guid id)
        {
            return await _dbContext.UserStatistics
                .FirstOrDefaultAsync(s => s.Id == id.ToString());
        }

        public IQueryable<UserStatistics> GetQueryable()
        {
            return _dbContext.UserStatistics;
        }

        public async Task<UserStatistics> UpdateAsync(Guid id, UserStatistics dbModel)
        {
            dbModel.Id = id.ToString();
            _dbContext.Entry(dbModel).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }
    }
}
