using Microsoft.AspNet.SignalR.Hubs;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using R6MatchFinder.Common.Web.Model;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Database.Repository;
using System.Threading.Tasks;

namespace R6MatchFinder.Hubs
{
    [HubName("activeGameHub")]
    public class ActiveGameHub : AbstractHub
    {
        private readonly IAsyncRepository<GameChat> _chatRepository;
        private readonly IAsyncRepository<ActiveGame> _activeGameRepository;

        public ActiveGameHub(IAsyncRepository<GameChat> chatRepository, IAsyncRepository<ActiveGame> activeGameRepo)
        {
            _chatRepository = chatRepository;
            _activeGameRepository = activeGameRepo;
        }

        public async Task ConnectToGame(Guid gameId)
        {
            ActiveGame dbModel = await _activeGameRepository.GetAsync(gameId);

            if (dbModel == null)
                throw new Exception("Game not Found!");

            await Groups.Add(Context.ConnectionId, gameId.ToString());
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

            await Clients.Group(gameId.ToString()).ReceiveMessage(webModel);
        }
    }
}