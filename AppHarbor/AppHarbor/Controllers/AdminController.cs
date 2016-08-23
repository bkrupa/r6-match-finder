using R6MatchFinder.Attributes;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [AuthorizeAdmin, RoutePrefix("Admin")]
    public class AdminController : ApiController
    {
        
    }
}
