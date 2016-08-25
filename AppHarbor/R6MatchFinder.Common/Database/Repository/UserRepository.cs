using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public class UserRepository : IReadOnlyAsyncRepository<User>
    {
        private readonly IDbContext _dbContext;

        public UserRepository(IDbContext context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<User> GetAsync(Guid id)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id.ToString());
        }

        public IQueryable<User> GetQueryable()
        {
            return _dbContext.Users;
        }
    }
}
