using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;
using System;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGame : IWebModel<Game>
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }

        public WMUser User { get; set; }
    }
}
