using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace R6MatchFinder.Hubs
{
    public abstract class AbstractHub : Hub
    {
        protected string UserId { get { return Context.User.Identity.GetUserId(); } }
        protected readonly ConcurrentDictionary<string, string> ConnectedUsers = new ConcurrentDictionary<string, string>();

        public AbstractHub()
        {
        }

        #region Connect/Disconnect
        public override Task OnConnected()
        {
            ConnectedUsers.AddOrUpdate(Context.ConnectionId, UserId, (Cid, Uid) => UserId);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string Uid;
            ConnectedUsers.TryRemove(Context.ConnectionId, out Uid);
            return base.OnDisconnected(stopCalled);
        }
        #endregion
    }
}