using System;
using System.Linq;
using System.Xml.Linq;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using NXKit.Xml;

namespace NXKit.View.Server.Serialization
{

    /// <summary>
    /// Provides methods to work with remote NXKit interfaces.
    /// </summary>
    public static class RemoteHelper
    {

        static readonly RemoteJsonSerializer serializer = new RemoteJsonSerializer();

        /// <summary>
        /// Gets the remote interface values from the given <see cref="XElement"/> as a <see cref="JObject"/>.
        /// </summary>
        /// <param name="writer"></param>
        /// <param name="element"></param>
        public static void GetJson(JsonWriter writer, XElement element)
        {
            if (writer is null)
                throw new ArgumentNullException(nameof(writer));
            if (element is null)
                throw new ArgumentNullException(nameof(element));

            serializer.Serialize(writer, element);
        }

        /// <summary>
        /// Gets the <see cref="RemoteDescriptor"/> for the given remote interface on the given <see cref="XNode"/>.
        /// </summary>
        /// <param name="node"></param>
        /// <param name="interfaceName"></param>
        /// <returns></returns>
        static RemoteDescriptor GetRemoteDescriptor(XNode node, string interfaceName)
        {
            if (node is null)
                throw new ArgumentNullException(nameof(node));
            if (string.IsNullOrWhiteSpace(interfaceName))
                throw new ArgumentOutOfRangeException(nameof(interfaceName));

            return RemoteObjectJsonConverter.GetRemotes(node.Interfaces<IExtension>())
                .FirstOrDefault(i => i.Type.FullName == interfaceName);
        }

        /// <summary>
        /// Initiates a remote interface property value update for the given <see cref="XNode"/>.
        /// </summary>
        /// <param name="node"></param>
        /// <param name="interfaceName"></param>
        /// <param name="propertyName"></param>
        /// <param name="jvalue"></param>
        public static void Update(XNode node, string interfaceName, string propertyName, JValue jvalue)
        {
            if (node is null)
                throw new ArgumentNullException(nameof(node));
            if (string.IsNullOrWhiteSpace(interfaceName))
                throw new ArgumentOutOfRangeException(nameof(interfaceName));
            if (string.IsNullOrWhiteSpace(propertyName))
                throw new ArgumentOutOfRangeException(nameof(propertyName));
            if (jvalue is null)
                throw new ArgumentNullException(nameof(jvalue));

            var remote = GetRemoteDescriptor(node, interfaceName);
            if (remote == null)
                throw new InvalidOperationException();

            var property = remote.GetProperty(propertyName);
            if (property == null)
                throw new InvalidOperationException();

            // properties must be readable and writable
            if (!property.CanWrite ||
                !property.CanRead)
                throw new InvalidOperationException();

            // extract incoming value and convert to appropriate property value type
            var type = property.PropertyType;
            var value = jvalue?.ToObject(type);
            var oldValue = property.GetValue(remote.Target);

            // if value has been changed, apply change to remote
            if (!object.Equals(oldValue, value))
                property.SetValue(remote.Target, value);
        }

        /// <summary>
        /// Invokes a remote interface method for the given <see cref="XNode"/>.
        /// </summary>
        /// <param name="node"></param>
        /// <param name="interfaceName"></param>
        /// <param name="methodName"></param>
        /// <param name="args"></param>
        public static void Invoke(XNode node, string interfaceName, string methodName, JObject args)
        {
            if (node is null)
                throw new ArgumentNullException(nameof(node));
            if (string.IsNullOrWhiteSpace(interfaceName))
                throw new ArgumentOutOfRangeException(nameof(interfaceName));
            if (string.IsNullOrWhiteSpace(methodName))
                throw new ArgumentOutOfRangeException(nameof(methodName));
            if (args is null)
                throw new ArgumentNullException(nameof(args));

            var remote = GetRemoteDescriptor(node, interfaceName);
            if (remote == null)
                throw new InvalidOperationException();

            var method = remote.GetMethod(methodName);
            if (method == null)
                throw new InvalidOperationException();

            if (!method.IsPublic)
                return;

            // assembly invocation parameter list
            var count = 0;
            var parameters = method.GetParameters();
            var invoke = new object[parameters.Length];
            for (int i = 0; i < invoke.Length; i++)
            {
                // submitted JSON parameter value
                var j = args.Properties()
                    .FirstOrDefault(k => string.Equals(parameters[i].Name, k.Name, StringComparison.InvariantCultureIgnoreCase));
                if (j == null)
                    break;

                // convert JObject to appropriate type
                var t = parameters[i].ParameterType;
                var o = j != null && j.Value != null ? j.Value.ToObject(t) : null;

                // successful conversion
                invoke[i] = o;
                count = i + 1;
            }

            // unsuccessful parameter count, try next method
            if (count != parameters.Length)
                return;

            // successful; done with invoke object
            method.Invoke(remote.Target, invoke);
        }

    }

}
