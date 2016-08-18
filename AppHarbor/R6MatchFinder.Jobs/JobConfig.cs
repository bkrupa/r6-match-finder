using System;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Quartz;
using R6MatchFinder.Jobs.Attributes;
using Quartz.Impl;

namespace R6MatchFinder.Jobs
{
    public static class JobConfig
    {
        public static void Start()
        {
            ISchedulerFactory schedFact = new StdSchedulerFactory();

            // get a scheduler
            IScheduler sched = schedFact.GetScheduler();
            sched.Start();

            foreach (Type jobType in Assembly.GetAssembly(typeof(JobConfig)).GetTypes())
            {
                ScheduledJobAttribute attr = Attribute.GetCustomAttribute(jobType, typeof(ScheduledJobAttribute)) as ScheduledJobAttribute;

                if (attr == null)
                    continue;

                // define the job and tie it to our HelloJob class
                IJobDetail job = JobBuilder.Create(jobType)
                    .WithIdentity(jobType.Name) // name "myJob", group "group1"
                    .Build();

                // Trigger the job to run now, and then every 40 seconds
                ITrigger trigger = TriggerBuilder.Create()
                    .WithIdentity(jobType.Name + " Trigger")
                    .StartNow()
                    .WithSimpleSchedule(x => x
                        .WithIntervalInMinutes(attr.IntervalInMinutes)
                        .RepeatForever())
                    .Build();

                // Tell quartz to schedule the job using our trigger
                sched.ScheduleJob(job, trigger);
            }
        }
    }
}
