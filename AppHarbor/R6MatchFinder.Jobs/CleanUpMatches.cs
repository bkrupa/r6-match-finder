using Quartz;
using R6MatchFinder.Common.Database;
using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Utilities;
using R6MatchFinder.Jobs.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Jobs
{
    [ScheduledJob(15)]
    public class CleanUpMatches : IJob
    {        
        public void Execute(IJobExecutionContext context)
        {
            try
            {
                using (R6Context dbContext = R6Context.New)
                {
                    IEnumerable<Game> gamesToRemove = dbContext.Games.Where(g => g.Date < DateTime.UtcNow).ToList();


                    foreach (Game game in gamesToRemove)
                        dbContext.Games.Remove(game);

                    dbContext.SaveChanges();
                }
            }
            catch(Exception ex)
            {
                Utilities.HandleException(ex);
            }
        }
    }
}
