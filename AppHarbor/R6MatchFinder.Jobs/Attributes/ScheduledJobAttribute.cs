using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace R6MatchFinder.Jobs.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class ScheduledJobAttribute : Attribute
    {
        public int IntervalInMinutes { get; private set; }

        public ScheduledJobAttribute(int intervalInMinutes)
        {
            this.IntervalInMinutes = intervalInMinutes;
        }
    }
}
