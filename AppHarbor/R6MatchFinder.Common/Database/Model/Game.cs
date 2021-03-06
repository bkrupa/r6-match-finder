﻿using R6MatchFinder.Common.Database.Abstracts;
using R6MatchFinder.Common.Database.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Data.Entity;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("Games")]
    public class Game : AbstractGame<GameMatchSettings, GameModeSettings>, IValidateEntity, MapTo<ActiveGame>
    {
        [ForeignKey("UserId")]
        public User Creator { get; set; }

        public IEnumerable<DbValidationError> Validate(DbEntityEntry entityEntry)
        {
            Game dbModel = entityEntry.Entity as Game;

            if (dbModel == null)
                yield return new DbValidationError("*", "Invalid Model Supplied");

            if (entityEntry.State == EntityState.Modified)
                yield return new DbValidationError("*", "Modifying existing games is not supported at this time!");

            if (dbModel.Date <= DateTimeOffset.UtcNow)
                yield return new DbValidationError("Date", "Supplied date must be in the future.");
        }
    }
}
