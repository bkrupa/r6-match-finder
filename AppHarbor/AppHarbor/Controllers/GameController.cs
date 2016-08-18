using Microsoft.AspNet.Identity;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utilities;
using R6MatchFinder.Common.Utility;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model;
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
        private readonly IDbContext DbContext;

        public GameController(IDbContext context)
        {
            this.DbContext = context;
        }

        [HttpGet, Route("")]
        public async Task<IEnumerable<WMGame>> Get()
        {
            DateTime start = DateTime.UtcNow;
            DateTime end = start.AddHours(6);

            IEnumerable<Game> games = await DbContext.Games
                .Where(g => g.Date > start && g.Date < end)
                .OrderBy(g => g.Date).ToListAsync();

            return games.ToWebModels<Game, WMGame>();
        }

        [HttpGet, Route("MyGames")]
        public async Task<IEnumerable<WMGame>> GetMyGames()
        {
            DateTime start = DateTime.UtcNow;
            DateTime end = start.AddHours(6);
            string userId = User.Identity.GetUserId();

            IEnumerable<Game> games = await DbContext.Games
                .Where(g => g.Date > start && g.Date < end && g.UserId == userId)
                .OrderBy(g => g.Date).ToListAsync();

            return games.ToWebModels<Game, WMGame>();
        }

        [HttpGet, Route("{id}")]
        public async Task<WMGame> Get(string id)
        {
            Game game = await DbContext.Games.FindAsync(Guid.Parse(id));

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
            Game dbModel = webModel.ToDbModel();

            if (dbModel == null)
                throw new HttpResponseException(HttpStatusCode.NotAcceptable);

            dbModel = DbContext.Games.Add(dbModel);

            await DbContext.SaveChangesAsync();

            return await Get(dbModel.Id.ToString());
        }

        [HttpDelete, Route("{id}")]
        public async Task Delete(string id)
        {
            Game dbModel = await DbContext.Games
                .Include(g => g.ModeSettings)
                .Include(g => g.MatchSettings)
                .FirstOrDefaultAsync(g => g.Id.ToString() == id);

            if (dbModel == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            if (dbModel.UserId.ToString() != User.Identity.GetUserId())
                throw new HttpResponseException(HttpStatusCode.Forbidden);

            DbContext.Games.Remove(dbModel);

            await DbContext.SaveChangesAsync();
        }
    }
}
