using R6MatchFinder.Common.Database.Abstracts;
using R6MatchFinder.Common.Database.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("GameMatchSettings")]
    public class GameMatchSettings : AbstractMatchSettings<Game>, MapTo<ActiveGameMatchSettings>
    {

    }
}
