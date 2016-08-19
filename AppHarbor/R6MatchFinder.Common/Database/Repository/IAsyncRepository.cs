using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    /// <summary>
    /// An interface for a repository with async crud operations
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IAsyncRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync();
        IQueryable<T> GetQueryable();
        Task<T> GetAsync(Guid id);
        Task<T> UpdateAsync(Guid id, T dbModel);
        Task DeleteAsync(T dbModel);
        Task<T> CreateAsync(T dbModel);
    }
}
