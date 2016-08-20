using R6MatchFinder.Common.Database.Abstracts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("CompleteGameModeSettings")]
    public class CompleteGameModeSettings : AbstractModeSettings<CompleteGame>
    {
    }
}
