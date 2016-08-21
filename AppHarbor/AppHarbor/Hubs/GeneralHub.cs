
using Microsoft.AspNet.SignalR.Hubs;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

using System.Net;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;

namespace R6MatchFinder.Hubs
{
    [HubName("generalHub")]
    public class GeneralHub : AbstractHub
    {
        public GeneralHub()
        {
        }

        public static void GameStateChanged()
        {
            GlobalHost.ConnectionManager.GetHubContext<GeneralHub>().Clients.All.RefreshGamesList();
        }
    }
}