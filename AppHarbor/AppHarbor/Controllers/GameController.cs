using Microsoft.AspNet.Identity;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Database.Repository;
using R6MatchFinder.Common.Utilities;
using R6MatchFinder.Common.Utility;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model;
using R6MatchFinder.Common.Web.Model.Abstract;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [RoutePrefix("Games")]
    public class GameController : ApiController
    {
        private readonly IOwnedAsyncRepository<Game> _gameRepository;
        private readonly IOwnedAsyncRepository<ActiveGame> _activeGameRepository;

        public GameController(IOwnedAsyncRepository<Game> repo, IOwnedAsyncRepository<ActiveGame> activeGameRepo)
        {
            _gameRepository = repo;
            _activeGameRepository = activeGameRepo;
        }

        [HttpGet, Route("")]
        public async Task<IEnumerable<WMGame>> Get()
        {
            DateTime start = DateTime.UtcNow;
            DateTime end = start.AddHours(6);

            IEnumerable<Game> games = await _gameRepository.GetQueryable()
                .Where(g => g.Date > start && g.Date < end)
                .OrderBy(g => g.Date).ToListAsync();

            return games.ToWebModels<Game, WMGame>();
        }

        [HttpGet, Route("MyGames")]
        public async Task<IEnumerable<WMGameBase>> GetMyGames()
        {
            IEnumerable<Game> games = await _gameRepository.GetForUserAsync(User.Identity.GetUserId());
            IEnumerable<ActiveGame> activeGames = await _activeGameRepository.GetForUserAsync(User.Identity.GetUserId());

            List<WMGameBase> rtn = new List<WMGameBase>();
            rtn.AddRange(games.ToWebModels<Game, WMGame>());
            rtn.AddRange(activeGames.ToWebModels<ActiveGame, WMActiveGame>());

            return rtn;
        }

        [HttpGet, Route("{id}")]
        public async Task<WMGame> Get(string id)
        {
            Game game = await _gameRepository.GetAsync(Guid.Parse(id));

            if (game == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return game.ToWebModel<Game, WMGame>();
        }

        [HttpGet, Route(Common.Utility.Constants.NEW_ID)]
        public WMGame GetNew()
        {
            return new WMGame
            {
                Id = Common.Utility.Constants.NEW_ID,
                UserId = User.Identity.GetUserId(),
                Date = Utilities.RoundUpDateTimeOffset(DateTimeOffset.UtcNow.AddMinutes(15), TimeSpan.FromMinutes(15)),
                Hud = HudSettings.Standard,
                Mode = GameMode.Bomb,
                Rules = RuleSet.Standard,
                Time = TimeOfDay.Day,
                PlayersPerTeam = 5,
                ModeSettings = new WMGameModeSettings(),
                MatchSettings = WMGameMatchSettings.DefaultSettings,
            };
        }

        [HttpPost, Route("{id}")]
        public async Task<WMGame> Post(string id, WMGame webModel)
        {
            webModel.UserId = User.Identity.GetUserId();

            Game dbModel = await _gameRepository.GetQueryable()
                 .Where(g => g.Date > DateTimeOffset.UtcNow)
                 .FirstOrDefaultAsync(g => g.UserId == webModel.UserId);

            if (dbModel != null)
            {
                bool isAdmin = await ApplicationUserManager.Current.IsInRoleAsync(webModel.UserId, Roles.Administrator.ToString());

                if (!isAdmin)
                    throw new HttpResponseException(HttpStatusCode.Conflict);
            }

            dbModel = webModel.ToDbModel();

            if (dbModel == null)
                throw new HttpResponseException(HttpStatusCode.NotAcceptable);

            dbModel = await _gameRepository.CreateAsync(dbModel);

            return await Get(dbModel.Id.ToString());
        }

        [HttpPost, Route("{id}/Join")]
        public async Task JoinGame(string id)
        {
            string userId = User.Identity.GetUserId();
            Game dbModel = await _gameRepository.GetAsync(Guid.Parse(id));

            if (dbModel == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            if (dbModel.UserId == userId)
                throw new HttpResponseException(HttpStatusCode.PreconditionFailed);

            ActiveGame activeGame = ActiveGame.FromGame(dbModel);
            activeGame.ChallengerId = userId;

            activeGame = await _activeGameRepository.CreateAsync(activeGame);
            await _gameRepository.DeleteAsync(dbModel);
        }

        [HttpDelete, Route("{id}")]
        public async Task Delete(string id)
        {
            Game dbModel = await _gameRepository.GetAsync(Guid.Parse(id));

            if (dbModel == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            if (dbModel.UserId.ToString() != User.Identity.GetUserId())
                throw new HttpResponseException(HttpStatusCode.Forbidden);

            await _gameRepository.DeleteAsync(dbModel);
        }
    }
}
