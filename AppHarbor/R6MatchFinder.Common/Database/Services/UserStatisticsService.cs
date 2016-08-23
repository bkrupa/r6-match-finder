using R6MatchFinder.Common.Database.Model;
using R6MatchFinder.Common.Database.Repository;
using System;
using System.Threading.Tasks;

namespace R6MatchFinder.Common.Database.Services
{
    public class UserStatisticsService : IService
    {
        public IAsyncRepository<UserStatistics> _repository;

        public UserStatisticsService(IAsyncRepository<UserStatistics> repository)
        {
            _repository = repository;
        }

        public async Task AddGamePlayed(Guid id)
        {
            UserStatistics dbModel = await _repository.GetAsync(id);

            // Increment the total rating by the supplied rating
            double totalNum = dbModel.AverageRating * dbModel.GamesPlayed;
            dbModel.GamesPlayed++;
            dbModel.AverageRating = totalNum / dbModel.GamesPlayed;

            await _repository.UpdateAsync(id, dbModel);
        }

        public async Task UpdateRating(Guid id, int rating)
        {
            UserStatistics dbModel = await _repository.GetAsync(id);

            // Increment the total rating by the supplied rating
            double totalNum = dbModel.AverageRating * dbModel.GamesPlayed;
            totalNum += rating;
            dbModel.AverageRating = totalNum / dbModel.GamesPlayed;

            await _repository.UpdateAsync(id, dbModel);
        }

        public async Task AddGameCreated(Guid id)
        {
            UserStatistics dbModel = await _repository.GetAsync(id);
            dbModel.GamesCreated++;
            await _repository.UpdateAsync(id, dbModel);
        }

        public async Task AddGameAbandoned(Guid id)
        {
            UserStatistics dbModel = await _repository.GetAsync(id);
            dbModel.GamesAbandoned++;
            await _repository.UpdateAsync(id, dbModel);
        }

        public async Task AddChallengeAccepted(Guid id)
        {
            UserStatistics dbModel = await _repository.GetAsync(id);
            dbModel.ChallengesAccepted++;
            await _repository.UpdateAsync(id, dbModel);
        }

        public async Task AddChallengeTaken(Guid id)
        {
            UserStatistics dbModel = await _repository.GetAsync(id);
            dbModel.ChallengesTaken++;
            await _repository.UpdateAsync(id, dbModel);
        }
    }
}
