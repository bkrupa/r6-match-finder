using Microsoft.AspNet.Identity;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Database.Repository;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using R6MatchFinder.Handlers;

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
        public Dictionary<string, string> GetCurrentUserInfo()
        {
            Dictionary<string, string> rtn =
                ((ClaimsIdentity)User.Identity).Claims.GroupBy(c => c.Type)
                .ToDictionary(g => g.Key.Split('/').Last(), g => string.Join(", ", g.Select(c => c.Value)));

            rtn["id"] = User.Identity.GetUserId();

            return rtn;
        }

        [HttpGet, Route("{id}/Info")]
        public async Task<Dictionary<string, string>> GetUserInfo(string id)
        {
            IList<Claim> claims = await ApplicationUserManager.Current.GetClaimsAsync(id);

            Dictionary<string, string> rtn = claims.GroupBy(c => c.Type)
                .ToDictionary(g => g.Key.Split('/').Last(), g => string.Join(", ", g.Select(c => c.Value)));
            rtn["id"] = id;

            return rtn;
        }

        [HttpGet, Route("{id}/Image")]
        public async Task<HttpResponseMessage> GetUserImage(string id)
        {
            IList<Claim> claims = await ApplicationUserManager.Current.GetClaimsAsync(id);
            Claim picClaim = claims.FirstOrDefault(c => c.Type == "picture");

            if (picClaim != null)
            {
                WebRequest request = WebRequest.Create(picClaim.Value);

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (MemoryStream stream = new MemoryStream())
                {
                    await response.GetResponseStream().CopyToAsync(stream);
                    stream.Seek(0, SeekOrigin.Begin);


                    HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                    result.Content = new ByteArrayContent(stream.ToArray());
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
                    return result;
                }
            }

            // Get here if the user doesn't have a "picture" claim
            HttpResponseMessage redirResponse = Request.CreateResponse(HttpStatusCode.TemporaryRedirect);
            redirResponse.Headers.Location = new Uri("~/Images/Portrait_placeholder.png");
            return redirResponse;
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
