using Microsoft.AspNet.Identity;
using R6MatchFinder;
using R6MatchFinder.App_Start;
using R6MatchFinder.Common.Configuration;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utilities;
using R6MatchFinder.Jobs;
using System;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.SessionState;

namespace AppHarbor
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            Configuration.ConfigureAutoMapper();

            JobConfig.Start();
        }


        protected void Application_PostAuthorizeRequest()
        {
            // Allow multiple requests at once
            HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.ReadOnly);


            string userId = User.Identity.GetUserId();

            if (!string.IsNullOrWhiteSpace(userId))
            {
                User dbUser = ApplicationUserManager.Current.FindById(userId);

                if (dbUser == null || dbUser.Disabled || ApplicationUserManager.Current.IsLockedOut(userId))
                {
                    HttpContext.Current.GetOwinContext().Authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                    HttpContext.Current.Response.ClearContent();
                    Response.StatusCode = Convert.ToInt32(HttpStatusCode.Unauthorized);
                }
            }
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Exception ex = HttpContext.Current.Server.GetLastError();
            Utilities.HandleException(ex);
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_EndRequest(object sender, EventArgs e)
        {
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}