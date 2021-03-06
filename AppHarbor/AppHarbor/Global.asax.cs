﻿
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using R6MatchFinder;
using R6MatchFinder.App_Start;
using R6MatchFinder.Common.Configuration;
using R6MatchFinder.Common.Database.Model;
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
    public class Global : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            Configuration.ConfigureAutoMapper();

            // This has to be done from global.asax and not in the rest of the signalR config
            // otherwise GlobalHost.ConnectionManager.GetHubContext<T> won't return the right client set
            // http://stackoverflow.com/questions/20561196/signalr-calling-client-method-from-outside-hub-using-globalhost-connectionmanage
            GlobalHost.DependencyResolver = NinjectWebCommon.Resolver;

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
            R6MatchFinder.Common.Utility.Utilities.HandleException(ex);
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