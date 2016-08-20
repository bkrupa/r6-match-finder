using Microsoft.AspNet.Identity.EntityFramework;
using R6MatchFinder.Common.Database.Interfaces;
using R6MatchFinder.Common.Database.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Linq;
using System.Reflection;

namespace R6MatchFinder.Common.Database
{
    public class R6Context : IdentityDbContext<User>, IDbContext
    {

        public DbSet<Game> Games { get; set; }
        public DbSet<GameMatchSettings> MatchSettings { get; set; }
        public DbSet<GameModeSettings> ModeSettings { get; set; }

        public DbSet<ActiveGame> ActiveGames { get; set; }
        public DbSet<ActiveGameMatchSettings> ActiveGameMatchSettings { get; set; }
        public DbSet<ActiveGameModeSettings> ActiveGameModeSettings { get; set; }

        public DbSet<CompleteGame> CompleteGames { get; set; }
        public DbSet<CompleteGameMatchSettings> CompleteGameMatchSettings { get; set; }
        public DbSet<CompleteGameModeSettings> CompleteGameModeSettings { get; set; }

        public DbSet<UserStatistics> UserStatistics { get; set; }
        public DbSet<UserAccounts> UserAccounts { get; set; }

        public DbSet<ExceptionLog> Exceptions { get; set; }
        public DbSet<LoginLog> LoginLog { get; set; }

        public R6Context() : base(ConfigurationManager.AppSettings["SQLSERVER_CONNECTION_STRING"])
        {
            System.Data.Entity.Database.SetInitializer<R6Context>(null);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            Type iFluentModel = typeof(IFluentModel);
            IEnumerable<Type> types = GetType().Assembly.GetTypes().Where(t => iFluentModel.IsAssignableFrom(t) && t.IsClass);

            foreach (Type t in types)
            {
                IFluentModel model = Activator.CreateInstance(t) as IFluentModel;
                model.OnModelCreating(modelBuilder);
            }
        }

        protected override DbEntityValidationResult ValidateEntity(DbEntityEntry entityEntry, IDictionary<object, object> items)
        {
            IValidateEntity validateEntity = entityEntry.Entity as IValidateEntity;
            DbEntityValidationResult result = base.ValidateEntity(entityEntry, items);

            if (validateEntity != null)
                foreach (DbValidationError error in validateEntity.Validate(entityEntry))
                    result.ValidationErrors.Add(error);

            if (entityEntry.State == EntityState.Modified)
            {
                foreach (PropertyInfo info in entityEntry.Entity.GetType().GetProperties().Where(p => p.IsDefined(typeof(ReadOnlyAttribute))))
                {
                    if (!entityEntry.CurrentValues[info.Name].Equals(entityEntry.OriginalValues[info.Name]))
                        result.ValidationErrors.Add(new DbValidationError(info.Name, CommonResources.YOU_CANNOT_EDIT_THE_FOLLOWING_PROPERTY.Replace("#prop#", info.Name)));
                }
            }

            return result;
        }

        public static R6Context New
        {
            get
            {
                return Create();
            }
        }

        public static R6Context Create()
        {
            return new R6Context();
        }
    }
}
