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
            app.MapSignalR();
        }
    }
}
