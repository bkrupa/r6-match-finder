using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(R6MatchFinder.Startup))]

namespace R6MatchFinder
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            var config = new HubConfiguration();
            config.EnableDetailedErrors = true;
            app.MapSignalR(config);
        }
    }
}
