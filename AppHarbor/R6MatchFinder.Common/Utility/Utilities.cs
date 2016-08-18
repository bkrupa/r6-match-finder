using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using System;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Utilities
{
    public static class Utilities
    {
        public static async Task HandleException(Exception ex)
        {
            try
            {
                using (R6Context context = R6Context.New)
                {

                    ExceptionLog dbException = null;
                    do
                    {
                        dbException = new ExceptionLog
                        {
                            Parent = dbException,
                            Message = ex.Message,
                            StackTrace = ex.StackTrace
                        };

                        context.Exceptions.Add(dbException);

                        ex = ex.InnerException;
                    } while (ex != null);

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                // catch this exception here.  
                // We don't want this to end in an infinite loop.
            }
        }


        public static DateTimeOffset RoundUpDateTimeOffset(DateTimeOffset dt, TimeSpan d)
        {
            return new DateTimeOffset(((dt.Ticks + d.Ticks - 1) / d.Ticks) * d.Ticks, dt.Offset);
        }
    }
}
