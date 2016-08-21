using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGameChat : IWebModel<GameChat>
    {
        public string Id { get; set; }

        public string ActiveGameId { get; set; }
        public WMActiveGame ActiveGame { get; set; }

        public string CompleteGameId { get; set; }
        public WMCompleteGame CompleteGame { get; set; }

        public string FromUserId { get; set; }
        public WMUser FromUser { get; set; }

        public string Message { get; set; }
        public DateTimeOffset Date { get; set; }
    }
}
