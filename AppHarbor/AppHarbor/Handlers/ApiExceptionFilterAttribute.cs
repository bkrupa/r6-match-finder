using R6MatchFinder.Common.Utility;
using System;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace R6MatchFinder.Handlers
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            // Don't worry about awaiting this call, set and forget
            Utilities.HandleException(actionExecutedContext.Exception);

            string message;


            try
            {
                // Throw it so we can catch based on type
                throw actionExecutedContext.Exception;
            }
            catch (OperationCanceledException e)
            {
                /* Do Nothing */
            }
            catch (DbEntityValidationException ex)
            {
                message = string.Join(Environment.NewLine, ex.EntityValidationErrors.SelectMany(v => v.ValidationErrors.Select(e => e.ErrorMessage)));

                actionExecutedContext.Response = new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.NotAcceptable,
                    Content = new StringContent(message),
                    ReasonPhrase = message
                };
            }

            base.OnException(actionExecutedContext);
        }
    }
}
