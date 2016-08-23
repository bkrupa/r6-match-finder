using System.Web.Mvc;
using System.Web.Routing;

namespace R6MatchFinder.App_Start
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "AccountRoute",
                url: "Account/{action}",
                defaults: new { controller = "Account", action = "Login" }
            );

            routes.MapRoute(
                name: "ManageRoute",
                url: "Manage/{action}",
                defaults: new { controller = "Manage", action = "Index" }
            );

            routes.MapRoute(
                name: "Join",
                url: "Join",
                defaults: new { controller = "Action", action = "Join" }
            );

            routes.MapRoute(
                name: "AppRoute",
                url: "{*catchall}",
                defaults: new { controller = "Home", action = "Index", }
            );
        }
    }
}