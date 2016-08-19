using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [RoutePrefix("Discovery")]
    public class DiscoveryController : ApiController
    {
        [Route("Time")]
        public string GetTime()
        {
            return DateTimeOffset.UtcNow.ToString();
        }

        [HttpGet, Route("Username"), Authorize]
        public string GetUsername()
        {
            IOwinContext context = HttpContext.Current.GetOwinContext();
            ApplicationUserManager mgr = context.GetUserManager<ApplicationUserManager>();

            return HttpContext.Current.User.Identity.Name;
        }
    }
}
