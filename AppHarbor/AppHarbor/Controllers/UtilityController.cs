using R6MatchFinder.Attributes;
using R6MatchFinder.Common.Utility;
using R6MatchFinder.Formatters;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [AllowAnonymous, RoutePrefix("Utilities")]
    public class UtilityController : ApiController
    {
        [Route("Version")]
        [AllowAnonymous]
        public dynamic GetVersion()
        {
            string build = ((AssemblyInformationalVersionAttribute)Assembly
                            .GetExecutingAssembly()
                            .GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute), false)[0])
                            .InformationalVersion;

            return new
            {
                version = build
            };
        }

        #region Resources

        /// <summary>
        /// Returns a set of resources so they are exposed to angular
        /// REGEX for search: (.*\{\{resource\()(')?([\w\.]*)(')?(\)\}\}.*)
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        [HttpPost, Route("Resources"), ExactCaseFormatter]
        public Dictionary<string, string> GetResource(IEnumerable<string> values)
        {
            ResourceManager r = new ResourceManager("Resources.resources", Assembly.Load("App_GlobalResources"));

            return values.ToDictionary(v => v, v =>
            {
                string val = r.GetString(v) ??
                        r.GetString(v.ToString()) ??
                        null;

                if (val == null)
                {
                    if (!MissingResources.Contains(v))
                        MissingResources.Add(v);
                    val = v.ToString();
                }

                return val;
            });
        }

        private readonly static ConcurrentBag<string> MissingResources = new ConcurrentBag<string>();

        [HttpGet, Route("MissingResources"), AuthorizeAdmin]
        public IEnumerable<string> GetMissingResources()
        {
            return MissingResources;
        }

        #endregion




        [HttpGet, Route("Enums"), UpperCaseFormatter]
        public Dictionary<string, Dictionary<string, int>> GetEnums()
        {
            return Assembly.GetAssembly(typeof(Enums)).GetTypes().Where(t => t.IsEnum && t.IsPublic && t.IsDefined(typeof(PublicEnum))).ToDictionary(t => t.Name,
                t => Enum.GetValues(t).Cast<Enum>().ToDictionary(v => v.ToString(), v => Convert.ToInt32(v)));
        }
    }
}
