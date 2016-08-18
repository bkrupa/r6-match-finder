using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database
{
    public interface IDbContext
    {
        DbSet<Game> Games { get; }
        DbSet<ExceptionLog> Exceptions { get; }
        DbSet<LoginLog> LoginLog { get; }

        Task<int> SaveChangesAsync();
    }
}
