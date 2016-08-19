using System.Collections.Generic;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Repository
{
    public interface IOwnedAsyncRepository<T> : IAsyncRepository<T>
    {
        Task<IEnumerable<T>> GetForUserAsync(string userId);
    }
}
