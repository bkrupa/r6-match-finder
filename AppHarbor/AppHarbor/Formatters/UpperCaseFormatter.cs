using Newtonsoft.Json.Serialization;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Text.RegularExpressions;
using System.Web.Http.Filters;

namespace R6MatchFinder.Formatters
{
    public class UpperCaseFormatterAttribute : ActionFilterAttribute
    {
        private static JsonMediaTypeFormatter _upperCasingFormatter = new JsonMediaTypeFormatter();

        static UpperCaseFormatterAttribute()
        {
            _upperCasingFormatter.SerializerSettings.ContractResolver = new UpperCaseContractResolver();
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            ObjectContent content = actionExecutedContext.Response.Content as ObjectContent;
            if (content != null)
            {
                if (content.Formatter is JsonMediaTypeFormatter)
                {
                    actionExecutedContext.Response.Content = new ObjectContent(content.ObjectType, content.Value, _upperCasingFormatter);
                }
            }
        }

        public class UpperCaseContractResolver : DefaultContractResolver
        {
            protected override string ResolvePropertyName(string propertyName)
            {
                return Regex.Replace(propertyName, @"(.{1})(?<!_)([A-Z])", "$1_$2").ToUpper();
            }
        }
    }
}