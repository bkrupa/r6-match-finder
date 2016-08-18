using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [RoutePrefix("Users")]
    public class UserController : ApiController
    {
        [HttpGet, Route("")]
        public Dictionary<string, string> GetUserInfo()
        {
            Dictionary<string, string> rtn =
                ((ClaimsIdentity)User.Identity).Claims.GroupBy(c => c.Type).ToDictionary(g => g.Key.Split('/').Last(), g => string.Join(", ", g.Select(c => c.Value)));

            rtn["id"] = User.Identity.GetUserId();

            return rtn;
        }
    }
}
