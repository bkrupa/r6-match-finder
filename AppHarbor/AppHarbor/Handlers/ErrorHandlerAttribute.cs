using R6MatchFinder.Common.Utilities;
using System.Web.Mvc;

namespace R6MatchFinder.Handlers
{
    public class ErrorHandlerAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            Utilities.HandleException(filterContext.Exception);
            base.OnException(filterContext);
        }
    }
}
