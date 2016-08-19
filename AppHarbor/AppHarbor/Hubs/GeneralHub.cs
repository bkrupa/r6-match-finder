
using Microsoft.AspNet.SignalR.Hubs;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

using System.Net;

namespace R6MatchFinder.Hubs
{
    [HubName("generalHub")]
    public class GeneralHub : Hub
    {
        private string UserId { get { return ApplicationUserManager.GetUserId(); } }
        private readonly ConcurrentDictionary<string, string> ConnectedUsers = new ConcurrentDictionary<string, string>();

        #region Connect/Disconnect
        public void Connect()
        {
            ConnectedUsers.AddOrUpdate(Context.ConnectionId, UserId, (Cid, Uid) => UserId);
            Groups.Add(Context.ConnectionId, UserId);
        }

        public void Disconnect()
        {
            string Uid;

            if (ConnectedUsers.TryGetValue(Context.ConnectionId, out Uid))
                Groups.Remove(Context.ConnectionId, Uid);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            Disconnect();
            return base.OnDisconnected(stopCalled);
        }
        #endregion

        public static void GameStateChanged()
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<GeneralHub>();
            context.Clients.All.RefreshGamesList();
        }
    }
}