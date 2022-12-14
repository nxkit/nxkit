using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using NXKit.Util;

namespace NXKit.View.Server.Serialization
{

    /// <summary>
    /// Provides a converter to emit objects marked with <see cref="RemoteAttribute"/> as JSON.
    /// </summary>
    public class RemoteObjectJsonConverter :
        JsonConverter
    {

        static readonly ConcurrentDictionary<Type, List<Type>> remoteTypeCache =
            new ConcurrentDictionary<Type, List<Type>>();

        static readonly ConcurrentDictionary<Type, List<PropertyInfo>> remotePropertyCache =
            new ConcurrentDictionary<Type, List<PropertyInfo>>();

        static readonly ConcurrentDictionary<Type, List<MethodInfo>> remoteMethodCache =
            new ConcurrentDictionary<Type, List<MethodInfo>>();


        /// <summary>
        /// Gets the supported remote interface types of the given <see cref="object"/>.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        internal static IEnumerable<RemoteDescriptor> GetRemotes(object obj)
        {
            if (obj is null)
                throw new ArgumentNullException(nameof(obj));

            return GetRemotes(new[] { obj });
        }

        /// <summary>
        /// Gets the combined supported remote interface types of the given objects.
        /// </summary>
        /// <param name="objects"></param>
        internal static IEnumerable<RemoteDescriptor> GetRemotes(IEnumerable<object> objects)
        {
            if (objects is null)
                throw new ArgumentNullException(nameof(objects));

            return objects
                .Where(i => i != null)
                .Select(i => new
                {
                    Target = i,
                    Types = GetRemoteTypes(i),
                })
                .Where(i => i.Types.Any())
                .SelectMany(i => i.Types
                    .Select(j => new
                    {
                        Target = i.Target,
                        Type = j,
                    }))
                .GroupBy(i => i.Type)
                .Select(i => i.First())
                .Select(i => new RemoteDescriptor(i.Target, i.Type));
        }

        /// <summary>
        /// Gets all the supported remote interface types for the specified object.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        internal static IEnumerable<Type> GetRemoteTypes(object obj)
        {
            if (obj is null)
                throw new ArgumentNullException(nameof(obj));

            return GetRemoteTypes(obj.GetType());
        }

        /// <summary>
        /// Gets all the supported remote interface types for the specified type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        internal static IEnumerable<Type> GetRemoteTypes(Type type)
        {
            if (type is null)
                throw new ArgumentNullException(nameof(type));

            return remoteTypeCache.GetOrAdd(type, k =>
                TypeDescriptor.GetReflectionType(k)
                    .GetInterfaces()
                    .Concat(TypeDescriptor.GetReflectionType(k)
                        .Recurse(i => i.BaseType))
                    .Where(i => i.GetCustomAttribute<RemoteAttribute>(false) != null)
                    .ToList());
        }

        /// <summary>
        /// Gets the supported remote properties of the given type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        internal static IEnumerable<PropertyInfo> GetRemoteProperties(Type type)
        {
            if (type is null)
                throw new ArgumentNullException(nameof(type));

            return remotePropertyCache.GetOrAdd(type, k =>
                TypeDescriptor.GetReflectionType(k)
                    .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                    .Where(i => i.DeclaringType == k)
                    .Where(i => i.GetCustomAttribute<RemoteAttribute>(false) != null)
                    .GroupBy(i => i.Name)
                    .Select(i => i.First())
                    .ToList());
        }

        /// <summary>
        /// Gets the supported remote methods of the given type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        internal static IEnumerable<MethodInfo> GetRemoteMethods(Type type)
        {
            if (type is null)
                throw new ArgumentNullException(nameof(type));

            return remoteMethodCache.GetOrAdd(type, k =>
                TypeDescriptor.GetReflectionType(k)
                    .GetMethods(BindingFlags.Public | BindingFlags.Instance)
                    .Where(j => j.DeclaringType == k)
                    .Where(j => j.GetCustomAttribute<RemoteAttribute>(false) != null)
                    .GroupBy(j => j.Name)
                    .Select(j => j.First())
                    .ToList());
        }

        /// <summary>
        /// Null-safe invocation for JToken.FromObject.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        internal static JToken JTokenFromObject(object value, JsonSerializer serializer)
        {
            if (serializer is null)
                throw new ArgumentNullException(nameof(serializer));

            return value != null ? JToken.FromObject(value, serializer) : null;
        }

        /// <summary>
        /// Returns all of the properties for a given <see cref="RemoteDescriptor"/>.
        /// </summary>
        /// <param name="remote"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        internal static IEnumerable<JProperty> InterfaceToProperties(RemoteDescriptor remote, JsonSerializer serializer)
        {
            if (serializer is null)
                throw new ArgumentNullException(nameof(serializer));

            foreach (var property in GetRemoteProperties(remote.Type))
                yield return new JProperty(property.Name,
                    JTokenFromObject(property.GetValue(remote.Target), serializer));
        }

        /// <summary>
        /// Converts the given source object into a <see cref="JObject"/> of compatible interfaces.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        internal static void RemoteToObject(object source, JObject destination, JsonSerializer serializer)
        {
            if (source is null)
                throw new ArgumentNullException(nameof(source));
            if (destination is null)
                throw new ArgumentNullException(nameof(destination));
            if (serializer is null)
                throw new ArgumentNullException(nameof(serializer));

            // append interfaces to object
            destination.Add(
                GetRemotes(source)
                    .Select(i => new JProperty(
                        i.Type.FullName,
                        new JObject(
                            InterfaceToProperties(i, serializer)))));
        }

        /// <summary>
        /// Converts the given source object into a <see cref="JObject"/> of compatible interfaces.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        internal static JObject RemoteToObject(object source, JsonSerializer serializer)
        {
            if (source is null)
                throw new ArgumentNullException(nameof(source));
            if (serializer is null)
                throw new ArgumentNullException(nameof(serializer));

            var obj = new JObject();
            RemoteToObject(source, obj, serializer);
            return obj;
        }

        /// <summary>
        /// Converts the given set of source objects into a single <see cref="JObject"/> of compatible interfaces.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        internal static void RemotesToObject(IEnumerable<object> source, JObject destination, JsonSerializer serializer)
        {
            if (source is null)
                throw new ArgumentNullException(nameof(source));
            if (destination is null)
                throw new ArgumentNullException(nameof(destination));
            if (serializer is null)
                throw new ArgumentNullException(nameof(serializer));

            // append interfaces to object
            destination.Add(
                GetRemotes(source)
                    .Select(i => new JProperty(
                        i.Type.FullName,
                        new JObject(
                            InterfaceToProperties(i, serializer)))));
        }

        /// <summary>
        /// Converts the given set of source objects into a single <see cref="JObject"/> of compatible interfaces.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        internal static JObject RemotesToObject(IEnumerable<object> source, JsonSerializer serializer)
        {
            if (source is null)
                throw new ArgumentNullException(nameof(source));
            if (serializer is null)
                throw new ArgumentNullException(nameof(serializer));

            var obj = new JObject();
            RemotesToObject(source, obj, serializer);
            return obj;
        }


        public override bool CanConvert(Type objectType)
        {
            return GetRemoteTypes(objectType).Any();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public sealed override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var jobj = new JObject();
            Apply(value, serializer, jobj);
            jobj.WriteTo(writer);
        }

        protected virtual void Apply(object value, JsonSerializer serializer, JObject obj)
        {
            if (value is null)
                throw new ArgumentNullException(nameof(value));
            if (serializer is null)
                throw new ArgumentNullException(nameof(serializer));
            if (obj is null)
                throw new ArgumentNullException(nameof(obj));

            obj["Type"] = "Object";
            RemoteToObject(value, obj, serializer);
        }

    }

}
