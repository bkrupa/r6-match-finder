using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utility;
using System;
using System.Data.Entity.Migrations;

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
        }

    }
}
