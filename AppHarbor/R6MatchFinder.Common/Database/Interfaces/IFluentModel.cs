using System.Data.Entity;

namespace R6MatchFinder.Common.Database.Interfaces
{
    interface IFluentModel
    {
        void OnModelCreating(DbModelBuilder modelBuilder);
    }
}
