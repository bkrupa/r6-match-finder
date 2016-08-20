using AutoMapper;
using R6MatchFinder.Common.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace R6MatchFinder.Common.Web.Interfaces
{
    public interface IWebModel<T> where T : class
    {
    }

    public interface OnModelCreated<T, G> where T : IWebModel<G> where G : class
    {
        void OnModelCreated(T webModel, G dbModel);
    }

    public static class WebModelExtensions
    {
        public static T ToDbModel<T>(this IWebModel<T> webModel) where T : class
        {
            return Mapper.Map<T>(webModel);
        }

        public static WebModelType ToWebModel<T, WebModelType>(this T obj)
            where T : class
            where WebModelType : IWebModel<T>
        {
            WebModelType webModel = Mapper.Map<WebModelType>(obj);

            if (webModel is OnModelCreated<WebModelType, T>)
            {
                ((OnModelCreated<WebModelType, T>)webModel).OnModelCreated(webModel, obj);
            }

            return webModel;
        }

        public static IEnumerable<WebModelType> ToWebModels<T, WebModelType>(this IEnumerable<T> list)
            where T : class
            where WebModelType : IWebModel<T>
        {
            return list.Select(item => ToWebModel<T, WebModelType>(item));
        }

        public static bool IsNew<T>(this IWebModel<T> webModel) where T : class
        {
            IEnumerable<PropertyInfo> key = typeof(T).GetProperties().Cast<PropertyInfo>().Where(p => p.IsDefined(typeof(KeyAttribute)));

            if (!key.Any())
                throw new Exception("The given webModel doesn't have a primary key.");

            if (key.Count() > 1)
                throw new Exception("The given webModel has a composite key, and the Id cannot be determined.");

            PropertyInfo info = webModel.GetType().GetProperty(key.FirstOrDefault().Name);

            if (info == null)
                throw new Exception("Could not match the key property from the DB Model to a web model property.");

            return info.GetValue(webModel).ToString() == Constants.NEW_ID;
        }
    }
}
