using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Web.Model
{
    public class WMGameChatConfig
    {
        public WMUser Challenger { get; set; }
        public IEnumerable<WMGameChat> History { get; set; }
    }
}
