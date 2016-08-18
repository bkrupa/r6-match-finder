using R6MatchFinder.Common.Database.Abstracts;
using R6MatchFinder.Common.Database.Interfaces;
using R6MatchFinder.Common.Utility;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("Games")]
    public class Game : AbstractGame<GameMatchSettings, GameModeSettings>
    {

    }
}
