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
    using Hubs;
    using Microsoft.AspNet.SignalR.Hubs;
    using Microsoft.AspNet.SignalR.Infrastructure;
    using IoC;
    using Microsoft.AspNet.SignalR;

    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        public static DefaultDependencyResolver Resolver { get; private set; }

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
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                Resolver = new NinjectSignalRDependencyResolver(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
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

            IEnumerable<Type> allTypes = Assembly.GetAssembly(typeof(R6Context)).GetTypes();

            // Iterate over all types in the Common DLL.
            foreach (Type type in allTypes)
            {
                IEnumerable<Type> repoInterfaceTypes = type.GetInterfaces().Where(i =>
                                                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IAsyncRepository<>));

                // For any types that implement IAsyncRepository, bind IAsyncRepository<T> to the type.
                foreach (Type repoInterfaceType in repoInterfaceTypes)
                {
                    Type genericArg = repoInterfaceType.GetGenericArguments()[0];
                    Type repoType = typeof(IAsyncRepository<>).MakeGenericType(genericArg);

                    kernel.Bind(repoType).To(type);
                }

                // Do the same thing for IOwnedAsyncRepositories
                repoInterfaceTypes = type.GetInterfaces().Where(i =>
                                                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IOwnedAsyncRepository<>));

                foreach (Type repoInterfaceType in repoInterfaceTypes)
                {
                    Type genericArg = repoInterfaceType.GetGenericArguments()[0];
                    Type repoType = typeof(IOwnedAsyncRepository<>).MakeGenericType(genericArg);

                    kernel.Bind(repoType).To(type);
                }

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
