using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Database.Repository;
using R6MatchFinder.Common.Web.Interfaces;
using R6MatchFinder.Common.Web.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace R6MatchFinder.Controllers
{
    [RoutePrefix("Maps")]
    public class MapController : ApiController
    {
        private readonly IAsyncRepository<Map> _mapRepository;

        public MapController(IAsyncRepository<Map> mapRepository)
        {
            _mapRepository = mapRepository;
        }

        [HttpGet, Route("")]
        public async Task<IEnumerable<WMMap>> GetAll()
        {
            IEnumerable<Map> maps = await _mapRepository.GetAllAsync();
            return maps.ToWebModels<Map, WMMap>();
        }
    }
}
