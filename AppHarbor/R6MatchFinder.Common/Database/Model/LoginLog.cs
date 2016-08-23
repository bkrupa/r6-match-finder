using Microsoft.AspNet.Identity.Owin;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web;

namespace R6MatchFinder.Common.Database.Model
{
    [Table("LoginLog")]
    public class LoginLog
    {
        public LoginLog()
        {
            Id = Guid.NewGuid();
            Timestamp = DateTime.UtcNow;
        }

        [Key, ReadOnly(true)]
        public Guid Id { get; private set; }

        [ForeignKey("LoginUser")]
        public string UserId { get; set; }
        public User LoginUser { get; set; }

        [Required]
        public string UserName { get; set; }

        [ReadOnly(true), Required]
        public DateTimeOffset Timestamp { get; private set; }

        [ReadOnly(true), Required]
        public SignInStatus Status { get; private set; }

        [ReadOnly(true), Required]
        public string IPAddress { get; private set; }

        public static async Task Log(HttpRequestBase request, SignInStatus result, string username)
        {
            using (R6Context context = R6Context.New)
            {
                LoginLog log = new LoginLog
                {
                    UserName = username ?? "[UNKNOWN]",
                    Status = result,
                    IPAddress = request.UserHostAddress
                };

                log.LoginUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);

                context.LoginLog.Add(log);

                await context.SaveChangesAsync();
            }
        }
    }
}
