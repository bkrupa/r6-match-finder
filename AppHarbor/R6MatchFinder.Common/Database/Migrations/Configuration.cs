using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utility;
using System;
using System.Data.Entity.Migrations;
using System.Linq;

namespace R6MatchFinder.Common.Database.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<R6Context>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "R6.Objects.Database.R6Context";

        }

        protected override void Seed(R6Context context)
        {
            base.Seed(context);

            RoleManager<IdentityRole> RoleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));

            foreach (string role in System.Enum.GetNames(typeof(Roles)))
                if (!RoleManager.RoleExists(role)) RoleManager.Create(new IdentityRole(role));

            UserManager<User> UserManager = new UserManager<User>(new UserStore<User>(context));
            User dbUser = UserManager.FindByName("admin");

            if (dbUser == null)
            {
                var user = new User { UserName = "admin", Email = "r6.match.finder@gmail.com" };
                var result = UserManager.Create(user, "admin1");

                if (!result.Succeeded)
                    throw new Exception(string.Join(Environment.NewLine, result.Errors));



                foreach (IdentityRole role in context.Roles)
                    role.Users.Add(new IdentityUserRole { UserId = user.Id, RoleId = role.Id });
            }

            if (!context.Maps.Any())
            {
                context.Maps.Add(new Map { Name = "Consulate" });
                context.Maps.Add(new Map { Name = "Chalet" });
                context.Maps.Add(new Map { Name = "House" });
                context.Maps.Add(new Map { Name = "Hereford Base" });
                context.Maps.Add(new Map { Name = "Kanal" });
                context.Maps.Add(new Map { Name = "Club House" });
                context.Maps.Add(new Map { Name = "Bank" });
                context.Maps.Add(new Map { Name = "Border" });
                context.Maps.Add(new Map { Name = "Favelas" });
                context.Maps.Add(new Map { Name = "Yacht" });
                context.Maps.Add(new Map { Name = "Plane" });
                context.Maps.Add(new Map { Name = "Oregon" });
                context.Maps.Add(new Map { Name = "Kafe Dostoyevsky" });
            }
        }

    }
}
