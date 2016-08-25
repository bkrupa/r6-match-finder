using Microsoft.AspNet.SignalR.Hubs;
using R6MatchFinder.Common.Database.Model;
using System;
using R6MatchFinder.Common.Web.Model;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Database.Repository;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Collections.Concurrent;

namespace R6MatchFinder.Hubs
{
    [HubName("activeGameHub")]
    public class ActiveGameHub : AbstractHub
    {
        private readonly IReadOnlyAsyncRepository<User> _userRepository;
        private readonly IAsyncRepository<GameChat> _chatRepository;
        private readonly IAsyncRepository<ActiveGame> _activeGameRepository;

        private static readonly ConcurrentDictionary<string, List<Guid>> ClientsConnectedToGames = new ConcurrentDictionary<string, List<Guid>>();

        public ActiveGameHub(IReadOnlyAsyncRepository<User> userRepository, IAsyncRepository<GameChat> chatRepository, IAsyncRepository<ActiveGame> activeGameRepo)
        {
            _userRepository = userRepository;
            _chatRepository = chatRepository;
            _activeGameRepository = activeGameRepo;
        }

        public async Task ConnectToGame(Guid gameId)
        {
            User currentUser = await _userRepository.GetAsync(Guid.Parse(UserId));
            ActiveGame dbModel = await _activeGameRepository.GetAsync(gameId);

            if (dbModel == null)
                throw new Exception("Game not Found!");

            await Groups.Add(Context.ConnectionId, gameId.ToString());

            DateTimeOffset minDate = DateTimeOffset.UtcNow.AddDays(-1);
            IEnumerable<GameChat> chats = await _chatRepository.GetQueryable()
                .Where(c => c.ActiveGameId == gameId && c.Date > minDate)
                .OrderByDescending(c => c.Date)
                .Take(100)
                .ToListAsync();

            WMGameChatConfig config = new WMGameChatConfig
            {
                Challenger = dbModel.UserId == UserId ? dbModel.Challenger.ToWebModel<User, WMUser>() : dbModel.Creator.ToWebModel<User, WMUser>(),
                History = chats.OrderBy(c => c.Date).ToWebModels<GameChat, WMGameChat>(),
                IsUserConnected = IsUserConnectedToGame(dbModel.UserId == UserId ? dbModel.ChallengerId : dbModel.UserId, gameId)
            };

            Clients.Client(Context.ConnectionId).Initialize(gameId, UserId, config);

            if (!IsUserConnectedToGame(UserId, gameId))
            {
                IList<string> connectionIds = ClientsConnectedToGames.Where(kvp => kvp.Value.Any(g => g == gameId)).Select(k => k.Key).ToList();
                Clients.Clients(connectionIds).UserJoined(gameId, UserId, currentUser.ToWebModel<User, WMUser>());
            }

            List<Guid> connectedGames = ClientsConnectedToGames.GetOrAdd(Context.ConnectionId, (connId) => new List<Guid>());
            connectedGames.Add(gameId);
        }

        public async Task DisconnectFromGame(Guid gameId)
        {
            await CancelTyping(gameId);
            List<Guid> connectedGames;

            User currentUser = await _userRepository.GetAsync(Guid.Parse(UserId));

            if (ClientsConnectedToGames.TryGetValue(Context.ConnectionId, out connectedGames))
                connectedGames.Remove(gameId);

            if (!IsUserConnectedToGame(UserId, gameId))
            {
                IList<string> connectionIds = ClientsConnectedToGames.Where(kvp => kvp.Value.Any(g => g == gameId)).Select(k => k.Key).ToList();
                Clients.Clients(connectionIds).UserLeft(gameId, UserId, currentUser.ToWebModel<User, WMUser>());
            }
        }

        private static bool IsUserConnectedToGame(string userId, Guid gameId)
        {
            List<string> thisUserConnIds;
            ConnectionIdsForUser.TryGetValue(userId, out thisUserConnIds);
            return ClientsConnectedToGames.Where(kvp => thisUserConnIds.Contains(kvp.Key)).Any(kvp => kvp.Value.Contains(gameId));
        }

        public async Task SendMessage(Guid gameId, string message)
        {
            GameChat dbModel = await _chatRepository.CreateAsync(new GameChat
            {
                FromUserId = UserId,
                ActiveGameId = gameId,
                Message = message
            });

            dbModel = await _chatRepository.GetAsync(dbModel.Id);
            WMGameChat webModel = dbModel.ToWebModel<GameChat, WMGameChat>();

            Clients.Group(gameId.ToString()).ReceiveMessage(gameId, UserId, webModel);
        }

        public async Task StartTyping(Guid gameId)
        {
            await Clients.Group(gameId.ToString(), Context.ConnectionId).StartTyping(gameId, UserId);
        }

        public async Task CancelTyping(Guid gameId)
        {
            await Clients.Group(gameId.ToString(), Context.ConnectionId).CancelTyping(gameId, UserId);
        }

        public override async Task OnDisconnected(bool stopCalled)
        {
            List<Guid> connectedGames;

            if (ClientsConnectedToGames.TryRemove(Context.ConnectionId, out connectedGames))
                foreach (Guid gameId in connectedGames)
                    await DisconnectFromGame(gameId);

            await base.OnDisconnected(stopCalled);
        }
    }
}