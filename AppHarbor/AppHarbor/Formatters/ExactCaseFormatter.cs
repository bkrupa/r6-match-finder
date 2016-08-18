using Newtonsoft.Json.Serialization;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http.Filters;

namespace R6MatchFinder.Formatters
{
    public class ExactCaseFormatterAttribute : ActionFilterAttribute
    {
        private static JsonMediaTypeFormatter _upperCasingFormatter = new JsonMediaTypeFormatter();

        static ExactCaseFormatterAttribute()
        {
            _upperCasingFormatter.SerializerSettings.ContractResolver = new ExactCaseContractResolver();
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

        public class ExactCaseContractResolver : DefaultContractResolver
        {
            protected override string ResolvePropertyName(string propertyName)
            {
                return propertyName;
            }
        }
    }
}
