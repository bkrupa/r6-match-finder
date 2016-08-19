using R6MatchFinder.Common.Database.Abstracts;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("Games")]
    public class Game : AbstractGame<GameMatchSettings, GameModeSettings>
    {

    }
}
