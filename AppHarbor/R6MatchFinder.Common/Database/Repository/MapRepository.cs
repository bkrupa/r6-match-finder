using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public class MapRepository : IAsyncRepository<Map>
    {
        private IDbContext _dbContext;

        public MapRepository(IDbContext context)
        {
            _dbContext = context;
        }

        public async Task<Map> CreateAsync(Map dbModel)
        {
            dbModel = _dbContext.Maps.Add(dbModel);

            await _dbContext.SaveChangesAsync();

            return dbModel;
        }

        public async Task DeleteAsync(Map dbModel)
        {
            _dbContext.Maps.Remove(dbModel);

            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Map>> GetAllAsync()
        {
            return await _dbContext.Maps
                .ToListAsync();
        }

        public async Task<Map> GetAsync(Guid id)
        {
            return await _dbContext.Maps
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public IQueryable<Map> GetQueryable()
        {
            return _dbContext.Maps;
        }

        public async Task<Map> UpdateAsync(Guid id, Map dbModel)
        {
            dbModel.Id = id;
            _dbContext.Entry(dbModel).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return dbModel;
        }
    }
}
