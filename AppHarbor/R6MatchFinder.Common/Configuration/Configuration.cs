using AutoMapper;
using R6MatchFinder.Common.Database.Interfaces;
using R6MatchFinder.Common.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace R6MatchFinder.Common.Configuration
{
    public static class Configuration
    {
        public static void ConfigureAutoMapper()
        {
            Type iWebModel = typeof(IWebModel<>);

            Type wmCourse = typeof(Configuration).Assembly.GetTypes()[0];

            IEnumerable<Type> types = typeof(Configuration).Assembly.GetTypes().Where(t => t.GetInterfaces().Any(i =>
                                                    i.IsGenericType && i.GetGenericTypeDefinition() == iWebModel));

            foreach (Type webModel in types)
            {
                Type dbModel = webModel.GetInterfaces().FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == iWebModel);

                if (dbModel == null)
                    continue;

                dbModel = dbModel.GetGenericArguments()[0];

                Mapper.CreateMap(webModel, dbModel).IgnoreAllNonExisting(webModel, dbModel);
                Mapper.CreateMap(dbModel, webModel).IgnoreAllNonExisting(dbModel, webModel);
            }

            types = typeof(Configuration).Assembly.GetTypes().Where(t => t.GetInterfaces().Any(i =>
                                                    i.IsGenericType && i.GetGenericTypeDefinition() == typeof(MapTo<>)));

            foreach (Type sourceType in types)
            {
                Type destType = sourceType.GetInterfaces().FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(MapTo<>));

                if (destType == null)
                    continue;

                destType = destType.GetGenericArguments()[0];

                Mapper.CreateMap(sourceType, destType).IgnoreAllNonExisting(sourceType, destType);
            }

            Mapper.AssertConfigurationIsValid();
        }

        private static IMappingExpression IgnoreAllNonExisting(this IMappingExpression expression, Type TSource, Type TDestination)
        {
            TypeMap existingMaps = Mapper.GetAllTypeMaps().First(x => x.SourceType.Equals(TSource) && x.DestinationType.Equals(TDestination));
            IEnumerable<string> unmappedProps = existingMaps.GetUnmappedPropertyNames();

            foreach (string property in unmappedProps)
                expression.ForMember(property, opt => opt.Ignore());

            foreach (PropertyMap map in existingMaps.GetPropertyMaps())
            {
                if (unmappedProps.Contains(map.DestinationProperty.Name))
                    continue;

                if (!map.SourceMember.ReflectedType.IsAssignableFrom(TSource))
                    continue;

                Type t = map.SourceMember.MemberType == MemberTypes.Property
                    ? ((PropertyInfo)map.SourceMember).PropertyType
                    : map.SourceMember.MemberType == MemberTypes.Field
                    ? ((FieldInfo)map.SourceMember).FieldType
                    : null;

                if (t == null)
                    continue;


                if (t == typeof(string) && map.DestinationPropertyType == typeof(Guid))
                    map.AssignCustomValueResolver(new GuidToStringResolver(map.SourceMember));

                if (t == typeof(Guid) && map.DestinationPropertyType == typeof(string))
                    map.AssignCustomValueResolver(new StringToGuidResolver(map.SourceMember));

            }

            return expression;
        }

        private class GuidToStringResolver : ValueResolver<object, Guid>
        {
            readonly MemberInfo _info;

            public GuidToStringResolver(MemberInfo info)
            {
                _info = info;
            }

            protected override Guid ResolveCore(object source)
            {
                object value = _info.MemberType == MemberTypes.Property
                        ? ((PropertyInfo)_info).GetValue(source)
                        : _info.MemberType == MemberTypes.Field
                        ? ((FieldInfo)_info).GetValue(source)
                        : null;

                Guid temp;

                return Guid.TryParse(Convert.ToString(value), out temp) ? temp : Guid.Empty;
            }
        }

        private class StringToGuidResolver : ValueResolver<object, string>
        {
            readonly MemberInfo _info;

            public StringToGuidResolver(MemberInfo info)
            {
                _info = info;
            }

            protected override string ResolveCore(object source)
            {
                object value = _info.MemberType == MemberTypes.Property
                        ? ((PropertyInfo)_info).GetValue(source)
                        : _info.MemberType == MemberTypes.Field
                        ? ((FieldInfo)_info).GetValue(source)
                        : null;
                return value is Guid ? value.ToString() : null;
            }
        }
    }
}
