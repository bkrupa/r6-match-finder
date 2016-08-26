using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public interface IReadOnlyAsyncRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync();
        IQueryable<T> GetQueryable();
        Task<T> GetAsync(Guid id);
    }
}
