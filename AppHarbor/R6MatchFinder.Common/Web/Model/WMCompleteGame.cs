using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMCompleteGame : WMGameBase, IWebModel<CompleteGame>
    {
        public bool IsComplete { get { return true; } }
    }
}
