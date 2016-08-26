using Quartz;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Jobs.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;

namespace R6MatchFinder.Jobs
{
    [ScheduledJob(60)]
    public class CleanUpJobLog : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            try
            {
                using (R6Context dbContext = R6Context.New)
                {
                    Utilities.LogJob(this, dbContext, false);

                    IEnumerable<JobLog> records = dbContext.JobLog.Where(l => l.Date < DateTimeOffset.UtcNow.AddHours(-10));

                    foreach (JobLog log in records)
                        dbContext.JobLog.Remove(log);

                    dbContext.SaveChanges();

                    Utilities.LogJob(this, dbContext, true);
                }
            }
            catch (Exception ex)
            {
                Common.Utility.Utilities.HandleException(ex);
            }
        }
    }
}
