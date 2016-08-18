using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Web.Interfaces;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMUser : IWebModel<User>
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
