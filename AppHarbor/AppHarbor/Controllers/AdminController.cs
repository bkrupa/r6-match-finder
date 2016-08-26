using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using R6MatchFinder.Attributes;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Database.Repository;
using R6MatchFinder.Common.Database.Services;
using R6MatchFinder.Common.Utility;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [AuthorizeAdmin, RoutePrefix("Admin")]
    public class AdminController : ApiController
    {
        private readonly IReadOnlyAsyncRepository<User> _userRepository;
        private readonly IDbContext _dbContext;

        public AdminController(IReadOnlyAsyncRepository<User> userRepository, IDbContext dbContext)
        {
            _userRepository = userRepository;
            _dbContext = dbContext;
        }


        [HttpGet, Route("Users")]
        public async Task<IEnumerable<WMUser>> FindUsers(string email)
        {
            IdentityRole adminRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.Name == Roles.Administrator.ToString());

            List<User> users = await _userRepository.GetQueryable()
                .Where(u => u.Email.Contains(email))
                .Where(u => !u.Roles.Any(r => r.RoleId == adminRole.Id))
                .Take(10).ToListAsync();

            return users.ToWebModels<User, WMUser>();
        }

        [HttpGet, Route("Users/Admin")]
        public async Task<IEnumerable<WMUser>> GetUsersWithAdmin()
        {
            IdentityRole adminRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.Name == Roles.Administrator.ToString());

            List<User> users = await _dbContext.Users
                .Where(u => u.Roles.Any(r => r.RoleId == adminRole.Id))
                .ToListAsync();

            return users.ToWebModels<User, WMUser>();
        }

        [HttpPost, Route("Users/{id}/GrantAdmin")]
        public async Task GrantUserAdminRights(string id)
        {
            await ApplicationUserManager.Current.AddToRoleAsync(id, Roles.Administrator.ToString());
        }

        [HttpPost, Route("Users/{id}/RevokeAdmin")]
        public async Task RevokeUserAdminRights(string id)
        {
            if (id == User.Identity.GetUserId())
                throw new HttpResponseException(System.Net.HttpStatusCode.MethodNotAllowed);

            await ApplicationUserManager.Current.RemoveFromRoleAsync(id, Roles.Administrator.ToString());
        }
    }
}
