using System.Reflection;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(R6MatchFinder.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethod(typeof(R6MatchFinder.App_Start.NinjectWebCommon), "Stop")]


namespace R6MatchFinder.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;
    using Common.Database;
    using System.Linq;
    using Common.Database.Repository;
    using System.Collections.Generic;
    using Common.Database.Services;
    using Microsoft.AspNet.SignalR;
    using Newtonsoft.Json;
    using SignalR;

    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        public static DefaultDependencyResolver Resolver { get; private set; }
        public static IKernel Kernel { get; private set; }

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }

        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            Kernel = new StandardKernel();
            try
            {
                Kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                Kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(Kernel);
                Resolver = new NinjectSignalRDependencyResolver(Kernel);
                return Kernel;
            }
            catch
            {
                Kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<IDbContext>().To<R6Context>().InRequestScope();

            JsonSerializerSettings settings = new JsonSerializerSettings();
            settings.ContractResolver = new SignalRContractResolver();
            JsonSerializer serializer = JsonSerializer.Create(settings);
            kernel.Bind<JsonSerializer>().ToConstant(serializer);

            IEnumerable<Type> allTypes = Assembly.GetAssembly(typeof(R6Context)).GetTypes();

            // Iterate over all types in the Common DLL.
            foreach (Type type in allTypes)
            {
                IEnumerable<Type> repoInterfaceTypes;

                // For any types that implement IReadOnlyAsyncRepository<T>, bind IReadOnlyAsyncRepository<T> to the type.
                #region IReadOnlyAsyncRepository
                repoInterfaceTypes = type.GetInterfaces().Where(i =>
                                                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IReadOnlyAsyncRepository<>));


                foreach (Type repoInterfaceType in repoInterfaceTypes)
                {
                    Type genericArg = repoInterfaceType.GetGenericArguments()[0];
                    Type repoType = typeof(IReadOnlyAsyncRepository<>).MakeGenericType(genericArg);

                    kernel.Bind(repoType).To(type);
                }
                #endregion

                // For any types that implement IAsyncRepository, bind IAsyncRepository<T> to the type.
                #region IAsyncRepository
                repoInterfaceTypes = type.GetInterfaces().Where(i =>
                                                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IAsyncRepository<>));

                foreach (Type repoInterfaceType in repoInterfaceTypes)
                {
                    Type genericArg = repoInterfaceType.GetGenericArguments()[0];
                    Type repoType = typeof(IAsyncRepository<>).MakeGenericType(genericArg);

                    kernel.Bind(repoType).To(type);
                }
                #endregion

                // Do the same thing for IOwnedAsyncRepositories
                #region IOwnedAsyncRepository
                repoInterfaceTypes = type.GetInterfaces().Where(i =>
                                                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IOwnedAsyncRepository<>));

                foreach (Type repoInterfaceType in repoInterfaceTypes)
                {
                    Type genericArg = repoInterfaceType.GetGenericArguments()[0];
                    Type repoType = typeof(IOwnedAsyncRepository<>).MakeGenericType(genericArg);

                    kernel.Bind(repoType).To(type);
                }
                #endregion

                // Do the same thing for IOwnedAsyncRepositories
                IEnumerable<Type> serviceTypes = type.GetInterfaces().Where(i => i == typeof(IService));

                if (serviceTypes.Any())
                {
                    kernel.Bind(type).ToSelf();
                }
            }
        }
    }
}
