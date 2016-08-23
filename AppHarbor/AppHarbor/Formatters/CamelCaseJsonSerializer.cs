using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace R6MatchFinder.Formatters
{
    public static class CamelCaseJsonSerializer
    {
        public static JsonSerializerSettings DefaultSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }
}