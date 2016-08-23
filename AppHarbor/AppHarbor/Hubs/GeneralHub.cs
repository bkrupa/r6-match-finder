
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR;

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