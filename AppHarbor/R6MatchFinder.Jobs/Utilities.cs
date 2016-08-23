using Quartz;
using R6MatchFinder.Common.Database;

namespace R6MatchFinder.Jobs
{
    public static class Utilities
    {
        public static void LogJob(IJob job, R6Context context, bool complete)
        {
            context.JobLog.Add(new Common.Database.Model.JobLog
            {
                Message = complete ? "Completed" : "Started",
                Job = job.GetType().Name
            });

            context.SaveChanges();
        }
    }
}
