using Quartz;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Utilities;
using R6MatchFinder.Jobs.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Jobs
{
    [ScheduledJob(1)]
    public class LogEveryMinute : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            try
            {
                using (R6Context dbContext = R6Context.New)
                {
                    dbContext.Log.Add(new Common.Database.Model.Log
                    {
                        Message = "Logged At " + DateTimeOffset.UtcNow
                    });

                    dbContext.SaveChanges();
                }

            }
            catch (Exception ex)
            {
                Utilities.HandleException(ex);
            }
        }
    }
}
