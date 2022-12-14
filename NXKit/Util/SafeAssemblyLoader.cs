using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;

using Microsoft.Extensions.DependencyModel;

namespace NXKit.Util
{

    public static class SafeAssemblyLoader
    {

        /// <summary>
        /// Catch exceptions when loading types.
        /// </summary>
        /// <param name="assembly"></param>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public static ICollection<Type> GetTypes(this Assembly assembly)
        {
            var l = new List<Type>();

            try
            {
                l = assembly.GetTypes()
                    .Where(i => i != null)
                    .ToList();
            }
            catch (ReflectionTypeLoadException e)
            {
                foreach (var t in e.Types)
                {
                    try
                    {
                        if (t != null)
                            l.Add(t);
                    }
                    catch (BadImageFormatException)
                    {
                        // ignore
                    }
                }
            }

            return l;
        }

#if NETSTANDARD2_0 || NETSTANDARD1_6

        /// <summary>
        /// Loads an <see cref="Assembly"/> from a path, ignoring failures.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static Assembly Load(string path, AssemblyLoadContext loadContext)
        {
            if (path == null)
                throw new ArgumentNullException(nameof(path));
            if (loadContext is null)
                throw new ArgumentNullException(nameof(loadContext));
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentOutOfRangeException(nameof(path));

            try
            {
                return loadContext.LoadFromAssemblyPath(path);
            }
            catch (Exception)
            {
                // ignore
            }

            return null;
        }

#endif

        /// <summary>
        /// Loads an <see cref="Assembly"/> from a path, ignoring failures.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static Assembly Load(string path)
        {
            if (path == null)
                throw new ArgumentNullException(nameof(path));
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentOutOfRangeException(nameof(path));

#if NETSTANDARD2_0 || NETSTANDARD1_6
            return Load(path, AssemblyLoadContext.Default);
#else

            try
            {
                return Assembly.LoadFrom(path);
            }
            catch (Exception)
            {
                // ignore
            }

            return null;
#endif
        }

#if NETSTANDARD2_0 || NETSTANDARD1_6

        /// <summary>
        /// Load all assemblies.
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Assembly> LoadAll(DependencyContext dependencyContext, AssemblyLoadContext assemblyLoadContext)
        {
            if (dependencyContext is null)
                throw new ArgumentNullException(nameof(dependencyContext));
            if (assemblyLoadContext is null)
                throw new ArgumentNullException(nameof(assemblyLoadContext));

            return dependencyContext.RuntimeLibraries
                .SelectMany(i => i.GetDefaultAssemblyNames(dependencyContext))
                .Select(i => LoadFromAssemblyName(i, assemblyLoadContext))
                .Where(i => i != null);
        }

        /// <summary>
        /// Load all assemblies.
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Assembly> LoadAll(DependencyContext dependencyContext)
        {
            if (dependencyContext is null)
                throw new ArgumentNullException(nameof(dependencyContext));

            return LoadAll(dependencyContext, AssemblyLoadContext.Default);
        }

        /// <summary>
        /// Load all assemblies.
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Assembly> LoadAll(AssemblyLoadContext assemblyLoadContext)
        {
            if (assemblyLoadContext is null)
                throw new ArgumentNullException(nameof(assemblyLoadContext));

            return LoadAll(DependencyContext.Default, assemblyLoadContext);
        }

        /// <summary>
        /// Load all assemblies.
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Assembly> LoadAll()
        {
            return LoadAll(DependencyContext.Default);
        }

        /// <summary>
        /// Safely loads the specified <see cref="Assembly"/>.
        /// </summary>
        /// <param name="assemblyName"></param>
        static Assembly LoadFromAssemblyName(AssemblyName assemblyName, AssemblyLoadContext assemblyLoadContext)
        {
            if (assemblyName is null)
                throw new ArgumentNullException(nameof(assemblyName));
            if (assemblyLoadContext is null)
                throw new ArgumentNullException(nameof(assemblyLoadContext));

            try
            {
                return assemblyLoadContext.LoadFromAssemblyName(assemblyName);
            }
            catch (Exception)
            {
                return null;
            }
        }

#else

        /// <summary>
        /// Load all assemblies.
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Assembly> LoadAll()
        {
            return GetBaseDirectories()
                .Where(i => !string.IsNullOrWhiteSpace(i))
                .Distinct()
                .Where(i => Directory.Exists(i))
                .SelectMany(i => Enumerable.Empty<string>()
                    .Concat(Directory.EnumerateFiles(i, "*.dll", SearchOption.TopDirectoryOnly))
                    .Concat(Directory.EnumerateFiles(i, "*.exe", SearchOption.TopDirectoryOnly)))
                .Distinct()
                .Select(i => Load(i))
                .Where(i => i != null);
        }

#endif

        /// <summary>
        /// Gets the application search paths.
        /// </summary>
        /// <returns></returns>
        static IEnumerable<string> GetBaseDirectories()
        {
#if NETSTANDARD2_0 || NETSTANDARD1_6
            yield return AppContext.BaseDirectory;
#else
            yield return AppDomain.CurrentDomain.BaseDirectory;
            yield return AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
            yield return AppDomain.CurrentDomain.SetupInformation.PrivateBinPath;
#endif
        }

    }

}
