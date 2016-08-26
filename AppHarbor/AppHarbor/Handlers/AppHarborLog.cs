using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Management;

namespace R6MatchFinder.Handlers
{
    public class AppHarborLog : WebRequestErrorEvent
    {
        private AppHarborLog(string message) : base(null, null, 100001, new Exception(message))
        {

        }

        public static void LogMessage(string message)
        {
            new AppHarborLog(message).Raise();
        }
    }
}