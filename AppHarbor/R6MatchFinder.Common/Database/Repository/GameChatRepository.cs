using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public class GameChatRepository : IAsyncRepository<GameChat>
    {
        private IDbContext _dbContext;

        public GameChatRepository(IDbContext context)
        {
            _dbContext = context;
        }

        public async Task<GameChat> CreateAsync(GameChat dbModel)
        {
            dbModel = _dbContext.GameChat.Add(dbModel);
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }

        public async Task DeleteAsync(GameChat dbModel)
        {
            _dbContext.GameChat.Remove(dbModel);

            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<GameChat>> GetAllAsync()
        {
            return await _dbContext.GameChat
                .Include(g => g.FromUser)
                .ToListAsync();
        }

        public async Task<GameChat> GetAsync(Guid id)
        {
            return await _dbContext.GameChat
                .Include(g => g.FromUser)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public IQueryable<GameChat> GetQueryable()
        {
            return _dbContext.GameChat;
        }

        public async Task<GameChat> UpdateAsync(Guid id, GameChat dbModel)
        {
            dbModel.Id = id;
            _dbContext.Entry(dbModel).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }
    }
}
