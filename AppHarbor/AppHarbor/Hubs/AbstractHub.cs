using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace R6MatchFinder.Hubs
{
    public abstract class AbstractHub : Hub
    {
        protected string UserId { get { return Context.User.Identity.GetUserId(); } }

        /// <summary>
        /// Key: Connection Id, Value: UserId
        /// </summary>
        protected static readonly ConcurrentDictionary<string, string> ConnectedUsers = new ConcurrentDictionary<string, string>();

        /// <summary>
        /// Key: UserId, Value: List of ConnectionIds
        /// </summary>
        protected static readonly ConcurrentDictionary<string, List<string>> ConnectionIdsForUser = new ConcurrentDictionary<string, List<string>>();

        public AbstractHub()
        {
        }

        #region Connect/Disconnect
        public override Task OnConnected()
        {
            ConnectedUsers.AddOrUpdate(Context.ConnectionId, UserId, (Cid, Uid) => UserId);

            List<string> connectionIds = ConnectionIdsForUser.GetOrAdd(UserId, new List<string>());
            connectionIds.Add(Context.ConnectionId);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string Uid;
            ConnectedUsers.TryRemove(Context.ConnectionId, out Uid);

            List<string> connectionIds;

            if (ConnectionIdsForUser.TryGetValue(UserId, out connectionIds))
            {
                connectionIds.Remove(Context.ConnectionId);

                if (!connectionIds.Any())
                {
                    ConnectionIdsForUser.TryRemove(UserId, out connectionIds);
                }
            }

            return base.OnDisconnected(stopCalled);
        }
        #endregion
    }
}