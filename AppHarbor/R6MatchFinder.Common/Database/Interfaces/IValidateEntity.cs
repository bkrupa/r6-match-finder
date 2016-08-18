using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;

namespace R6MatchFinder.Common.Database.Interfaces
{
    interface IValidateEntity
    {
        IEnumerable<DbValidationError> Validate(DbEntityEntry entityEntry);
    }
}
