using R6MatchFinder.Handlers;
using System.Web.Mvc;

namespace R6MatchFinder
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new ErrorHandlerAttribute());
            filters.Add(new AuthorizeAttribute());
        }
    }
}
