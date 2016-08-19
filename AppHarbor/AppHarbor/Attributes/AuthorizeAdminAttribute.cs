using Microsoft.AspNet.Identity;
using R6MatchFinder.Common.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace R6MatchFinder.Attributes
{
    public class AuthorizeAdminAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            base.OnAuthorization(actionContext);
        }

        public override async Task OnAuthorizationAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
        {
            await base.OnAuthorizationAsync(actionContext, cancellationToken);

            try
            {
                string userId = HttpContext.Current.User.Identity.GetUserId();

                IEnumerable<Roles> roles = (await ApplicationUserManager.Current.GetRolesAsync(userId)).Select(r => (Roles)Enum.Parse(typeof(Roles), r));

                if (!roles.Contains(Common.Utility.Roles.Administrator))
                    throw new UnauthorizedAccessException();
            }
            catch (Exception ex)
            {
                throw new UnauthorizedAccessException();
            }
        }
    }
}