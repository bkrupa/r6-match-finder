using Microsoft.AspNet.Identity;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Database.Repository;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [RoutePrefix("Users")]
    public class UserController : ApiController
    {
        private IAsyncRepository<UserStatistics> _statisticsRepository;

        public UserController(IAsyncRepository<UserStatistics> statsRepo)
        {
            _statisticsRepository = statsRepo;
        }

        [HttpGet, Route("")]
        public Dictionary<string, string> GetUserInfo()
        {
            Dictionary<string, string> rtn =
                ((ClaimsIdentity)User.Identity).Claims.GroupBy(c => c.Type).ToDictionary(g => g.Key.Split('/').Last(), g => string.Join(", ", g.Select(c => c.Value)));

            rtn["id"] = User.Identity.GetUserId();

            return rtn;
        }

        [HttpGet, Route("{id}/Statistics")]
        public async Task<WMUserStatistics> GetUserStatistics(string id)
        {
            UserStatistics stats = await _statisticsRepository.GetAsync(Guid.Parse(id));

            if (stats == null)
            {
                stats = await _statisticsRepository.CreateAsync(new UserStatistics { Id = User.Identity.GetUserId() });
            }

            return stats.ToWebModel<UserStatistics, WMUserStatistics>();
        }
    }
}
