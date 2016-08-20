﻿using Microsoft.AspNet.Identity;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Database.Repository;
using R6MatchFinder.Common.Database.Services;
using R6MatchFinder.Common.Utilities;
using R6MatchFinder.Common.Utility;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model;
using R6MatchFinder.Common.Web.Model.Abstract;
using R6MatchFinder.Hubs;
using Resources;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [RoutePrefix("Games")]
    public class GameController : ApiController
    {
        private readonly IOwnedAsyncRepository<Game> _gameRepository;
        private readonly IOwnedAsyncRepository<ActiveGame> _activeGameRepository;
        private readonly IOwnedAsyncRepository<CompleteGame> _completeGameRepository;
        private readonly UserStatisticsService _statsService;

        public GameController(IOwnedAsyncRepository<Game> repo, IOwnedAsyncRepository<ActiveGame> activeGameRepo,
            IOwnedAsyncRepository<CompleteGame> completeGameRepo, UserStatisticsService statsService)
        {
            _gameRepository = repo;
            _activeGameRepository = activeGameRepo;
            _completeGameRepository = completeGameRepo;
            _statsService = statsService;
        }

        [HttpGet, Route("")]
        public async Task<IEnumerable<WMGame>> Get()
        {
            DateTime start = DateTime.UtcNow;
            DateTime end = start.AddYears(6);

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
            IEnumerable<CompleteGame> completeGames = await _completeGameRepository.GetForUserAsync(User.Identity.GetUserId());

            List<WMGameBase> rtn = new List<WMGameBase>();
            rtn.AddRange(games.ToWebModels<Game, WMGame>());
            rtn.AddRange(activeGames.ToWebModels<ActiveGame, WMActiveGame>());
            rtn.AddRange(completeGames.ToWebModels<CompleteGame, WMCompleteGame>());

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

            IEnumerable<WMGameBase> myGames = await GetMyGames();

            if (myGames.Any(g => g.Date.Subtract(dbModel.Date).Duration().TotalHours < 1))
            {
                HttpResponseMessage resp = new HttpResponseMessage(HttpStatusCode.NotAcceptable);
                resp.Content = new StringContent(resources.PLEASE_ALLOW_ONE_HOUR_PRIOR_TO_A_GAMES_SCHEDULED_START_AND_ONE_HOUR_AFTER_CURRENT_GAME_CONFLICTS);
                throw new HttpResponseException(resp);
            }

            dbModel = await _gameRepository.CreateAsync(dbModel);
            await _statsService.AddGameCreated(Guid.Parse(User.Identity.GetUserId()));

            GeneralHub.GameStateChanged();
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

            IEnumerable<WMGameBase> myGames = await GetMyGames();

            if (myGames.Any(g => g.Date.Subtract(dbModel.Date).Duration().TotalHours < 1))
            {
                HttpResponseMessage resp = new HttpResponseMessage(HttpStatusCode.NotAcceptable);
                resp.Content = new StringContent(resources.PLEASE_ALLOW_ONE_HOUR_PRIOR_TO_A_GAMES_SCHEDULED_START_AND_ONE_HOUR_AFTER_CURRENT_GAME_CONFLICTS);
                throw new HttpResponseException(resp);
            }

            ActiveGame activeGame = ActiveGame.FromGame(dbModel);
            activeGame.ChallengerId = userId;

            activeGame = await _activeGameRepository.CreateAsync(activeGame);
            await _gameRepository.DeleteAsync(dbModel);

            await _statsService.AddChallengeAccepted(Guid.Parse(dbModel.UserId));
            await _statsService.AddChallengeTaken(Guid.Parse(User.Identity.GetUserId()));
            GeneralHub.GameStateChanged();
        }

        [HttpPost, Route("{id}/Complete")]
        public async Task CompleteActiveGame(string id, int rating)
        {
            string userId = User.Identity.GetUserId();
            ActiveGame dbModel = await _activeGameRepository.GetAsync(Guid.Parse(id));

            if (dbModel == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            if (dbModel.UserId != userId && dbModel.ChallengerId != userId)
                throw new HttpResponseException(HttpStatusCode.PreconditionFailed);

            if (rating < 1 || rating > 5)
                throw new HttpResponseException(HttpStatusCode.NotAcceptable);

            CompleteGame completeGame = CompleteGame.FromActiveGame(dbModel);

            if (completeGame.UserId == userId)
                completeGame.CreatorRating = rating;
            else if (completeGame.ChallengerId == userId)
                completeGame.ChallengerRating = rating;

            completeGame = await _completeGameRepository.CreateAsync(completeGame);
            await _activeGameRepository.DeleteAsync(dbModel);

            await _statsService.AddGamePlayed(Guid.Parse(completeGame.ChallengerId));
            await _statsService.AddGamePlayed(Guid.Parse(completeGame.UserId));

            // Make sure the ratings go toward the person on the other team.
            if (completeGame.UserId == userId)
                await _statsService.UpdateRating(Guid.Parse(completeGame.ChallengerId), rating);
            else if (completeGame.ChallengerId == userId)
                await _statsService.UpdateRating(Guid.Parse(completeGame.UserId), rating);

            GeneralHub.GameStateChanged();
        }

        [HttpPost, Route("{id}/Rate")]
        public async Task RateCompleteGame(string id, int rating)
        {
            throw new NotImplementedException();
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

            await _statsService.AddGameAbandoned(Guid.Parse(User.Identity.GetUserId()));

            GeneralHub.GameStateChanged();
        }
    }
}
