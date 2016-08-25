using System.Collections.Generic;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGameChatConfig
    {
        public WMUser Challenger { get; set; }
        public IEnumerable<WMGameChat> History { get; set; }
        public bool IsUserConnected { get; set; }
    }
}
