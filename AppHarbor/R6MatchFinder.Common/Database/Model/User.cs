using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("Users")]
    public class User : IdentityUser
    {
        public User()
        {
        }

        [InverseProperty("User")]
        public IEnumerable<Game> CreatedGames { get; set; }

        public bool Disabled { get; set; }

        public virtual UserStatistics Statistics { get; set; }


        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User, string> manager, IAuthenticationManager authentication = null)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here

            if (authentication != null)
            {
                ExternalLoginInfo info = authentication.GetExternalLoginInfo();

                if (info != null)
                    foreach (Claim claim in info.ExternalIdentity.Claims.Where(claim => !userIdentity.HasClaim(c => c.Type == claim.Type)))
                    {
                        userIdentity.AddClaim(claim);
                        await manager.AddClaimAsync(userIdentity.GetUserId(), claim);
                    }
            }

            return userIdentity;
        }

        public static async Task<IEnumerable<Role>> GetRolesForUser(string userId)
        {
            using (R6Context context = R6Context.New)
            {
                IEnumerable<IdentityRole> userRoles = await context.Roles.Where(r => r.Users.Select(u => u.UserId).Contains(userId)).ToListAsync();
                return userRoles.Select(r => (Role)Enum.Parse(typeof(Role), r.Name));
            }
        }

        public static async Task<bool> HasRole(string userId, Role role)
        {
            return (await GetRolesForUser(userId)).Contains(role);
        }

        public Task<bool> HasRole(Role role)
        {
            return HasRole(Id, role);
        }
    }
}
