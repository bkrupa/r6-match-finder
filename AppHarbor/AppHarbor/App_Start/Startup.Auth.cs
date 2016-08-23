using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System.Security.Claims;
using Newtonsoft.Json;
using R6MatchFinder.Providers;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Models;
using System.Configuration;
using Microsoft.Owin.Security.Facebook;
using Facebook;
using Microsoft.Owin.Security.MicrosoftAccount;
using Microsoft.Owin.Security.Twitter;
using System.Linq;

namespace R6MatchFinder
{
    public partial class Startup
    {
        // Enable the application to use OAuthAuthorization. You can then secure your Web APIs
        static Startup()
        {
            PublicClientId = "web";

            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                AuthorizeEndpointPath = new PathString("/Account/Authorize"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                AllowInsecureHttp = true
            };
        }

        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context, user manager and signin manager to use a single instance per request
            app.CreatePerOwinContext(R6Context.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.  
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, User>(
                        validateInterval: TimeSpan.FromMinutes(20),
                        regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager))
                }
            });
            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));

            // Enables the application to remember the second login verification factor such as phone or email.
            // Once you check this option, your second step of verification during the login process will be remembered on the device where you logged in from.
            // This is similar to the RememberMe option when you log in.
            app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

            #region Microsoft

            // Uncomment the following lines to enable logging in with third party login providers
            var microsoftOptions = new MicrosoftAccountAuthenticationOptions
            {
                ClientId = ConfigurationManager.AppSettings["MSClientId"],
                ClientSecret = ConfigurationManager.AppSettings["MSClientSecret"],
                Provider = new MicrosoftAccountAuthenticationProvider
                {
                    OnAuthenticated = (context) =>
                    {
                        context.Identity.AddClaim(new Claim(ClaimTypes.Name, context.Identity.FindFirstValue(ClaimTypes.Name)));
                        return System.Threading.Tasks.Task.FromResult(0);
                    }
                }
            };
            microsoftOptions.Scope.Add("wl.basic");
            microsoftOptions.Scope.Add("wl.emails");
            app.UseMicrosoftAccountAuthentication(microsoftOptions);

            #endregion


            var twitterOptions = new TwitterAuthenticationOptions
            {
                ConsumerKey = ConfigurationManager.AppSettings["TwitterClientId"],
                ConsumerSecret = ConfigurationManager.AppSettings["TwitterClientSecret"],
                BackchannelCertificateValidator = new Microsoft.Owin.Security.CertificateSubjectKeyIdentifierValidator(new[]
                    {
                        "A5EF0B11CEC04103A34A659048B21CE0572D7D47", // VeriSign Class 3 Secure Server CA - G2
                        "0D445C165344C1827E1D20AB25F40163D8BE79A5", // VeriSign Class 3 Secure Server CA - G3
                        "7FD365A7C2DDECBBF03009F34339FA02AF333133", // VeriSign Class 3 Public Primary Certification Authority - G5
                        "39A55D933676616E73A761DFA16A7E59CDE66FAD", // Symantec Class 3 Secure Server CA - G4
                        "‎add53f6680fe66e383cbac3e60922e3b4c412bed", // Symantec Class 3 EV SSL CA - G3
                        "4eb6d578499b1ccf5f581ead56be3d9b6744a5e5", // VeriSign Class 3 Primary CA - G5
                        "5168FF90AF0207753CCCD9656462A212B859723B", // DigiCert SHA2 High Assurance Server C‎A 
                        "B13EC36903F8BF4701D498261A0802EF63642BC3" // DigiCert High Assurance EV Root CA
                    }),
                Provider = new TwitterAuthenticationProvider
                {
                    OnAuthenticated = async context =>
                    {
                        context.Identity.AddClaim(new Claim(ClaimTypes.Name, context.ScreenName));
                        context.Identity.AddClaim(new Claim(ClaimTypes.Email, context.ScreenName + "@twitter.com"));
                    }
                }
            };
            app.UseTwitterAuthentication(twitterOptions);


            app.UseFacebookAuthentication(new FacebookAuthenticationOptions
            {
                AppId = ConfigurationManager.AppSettings["FacebookAppId"],
                AppSecret = ConfigurationManager.AppSettings["FacebookAppSecret"],
                Scope = { "email" },
                Provider = new FacebookAuthenticationProvider
                {
                    OnAuthenticated = async context =>
                    {
                        context.Identity.AddClaim(new Claim("FacebookAccessToken", context.AccessToken));
                        var fb = new FacebookClient(context.AccessToken);

                        object myInfo = fb.Get("/me?fields=name,id,email,first_name,last_name,gender,picture");
                        FacebookAccountInfo info = JsonConvert.DeserializeObject<FacebookAccountInfo>(myInfo.ToString());

                        info.email = info.email ?? (info.id + "@facebook.com");

                        context.Identity.AddClaim(new Claim(ClaimTypes.Name, info.id));
                        context.Identity.AddClaim(new Claim(ClaimTypes.Email, info.email));
                        context.Identity.AddClaim(new Claim("profile", info.picture.data.url));
                    }
                }
            });

            #region Google

            var googleOptions = new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = ConfigurationManager.AppSettings["GoogleClientId"],
                ClientSecret = ConfigurationManager.AppSettings["GoogleClientSecret"],
                Provider = new GoogleOAuth2AuthenticationProvider()
                {
                    OnAuthenticated = async context =>
                    {
                        GoogleAccountInfo info = JsonConvert.DeserializeObject<GoogleAccountInfo>(context.User.ToString());

                        context.Identity.AddClaim(new Claim(ClaimTypes.Name, info.emails.FirstOrDefault().value));
                        context.Identity.AddClaim(new Claim(ClaimTypes.Email, info.emails.FirstOrDefault().value));
                        context.Identity.AddClaim(new Claim("picture", info.image.url));
                        context.Identity.AddClaim(new Claim("profile", info.url ?? ""));
                    }
                },
            };

            googleOptions.Scope.Add("https://www.googleapis.com/auth/userinfo.profile");
            googleOptions.Scope.Add("https://www.googleapis.com/auth/userinfo.email");

            app.UseGoogleAuthentication(googleOptions);

            #endregion
        }
    }
}
