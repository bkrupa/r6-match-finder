using System.Web.Optimization;

namespace R6MatchFinder.App_Start
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/jquery-ui").Include("~/Scripts/jquery-ui-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/angular.js",
                "~/Scripts/angular-touch.js",
                "~/Scripts/angular-cookies.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/angular-sanitize.js",
                "~/Scripts/angular-resource.js",
                "~/Scripts/angular-filter/angular-filter.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular-ui").Include(
                "~/Scripts/angular-ui/ui-bootstrap.js",
                "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                "~/Scripts/angular-ui-router.js",
                "~/Scripts/moment.js"));


            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js"));
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/respond").Include("~/Scripts/respond.js"));
            bundles.Add(new ScriptBundle("~/bundles/toastr").Include("~/Scripts/toastr.js"));

            #region Styles

            bundles.Add(new StyleBundle("~/bundles/LibContent").Include(
                "~/Content/bootstrap.css",
                "~/Content/bootstrap-theme.css",
                "~/Content/font-awesome.css",
                "~/Content/toastr.css",
                "~/Content/zocial.css",
                "~/Content/fullcalendar.css"));

            bundles.Add(new StyleBundle("~/bundles/Content/app").Include(
                "~/Content/App/Spinners.css",
                "~/Content/App/Site.css"));

            #endregion


            #region Angular Custom

            bundles.Add(new ScriptBundle("~/bundles/Modules").Include("~/Views/Shared/r6-main-module.js").IncludeDirectory("~/Views", "*-module.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Config").IncludeDirectory("~/Views", "*-config.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Filters").IncludeDirectory("~/Views", "*-filter.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Interceptors").IncludeDirectory("~/Views", "*-interceptor.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Controllers").IncludeDirectory("~/Views", "*-controller.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Directives").IncludeDirectory("~/Views", "*-directive.js", true).IncludeDirectory("~/Views", "*-directives.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Services").IncludeDirectory("~/Views", "*-service.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Providers").IncludeDirectory("~/Views", "*-provider.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Repositories").IncludeDirectory("~/Views", "*-repository.js", true));
            bundles.Add(new ScriptBundle("~/bundles/Classes").IncludeDirectory("~/Views", "*-classes.js", true));

            #endregion

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            //BundleTable.EnableOptimizations = false;
        }
    }
}