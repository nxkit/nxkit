using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace NXKit
{

    /// <summary>
    /// Base class for an interface which provides XForms attributes of a specific element.
    /// </summary>
    public abstract class AttributeAccessor :
        ElementExtension
    {

        readonly XNamespace defaultNamespace;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="defaultNamespace"></param>
        public AttributeAccessor(XElement element, XNamespace defaultNamespace)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (defaultNamespace == null)
                throw new ArgumentNullException(nameof(defaultNamespace));

            this.defaultNamespace = defaultNamespace;
        }

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public AttributeAccessor(XElement element)
            : this(element, XNamespace.None)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

        public XAttribute GetAttribute(string name)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));

            var fq = Element.Attribute(defaultNamespace + name);
            if (fq != null)
                return fq;

            var ln = Element.Name.Namespace == defaultNamespace ? Element.Attribute(name) : null;
            if (ln != null)
                return ln;

            return null;
        }

        /// <summary>
        /// Gets the XForms attribute of the specified name.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public string GetAttributeValue(string name)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));

            return (string)GetAttribute(name);
        }

        /// <summary>
        /// Extracts a prefixed name from an attribute.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public XName GetAttributePrefixedName(string name)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));

            return GetAttributePrefixedNames(name).FirstOrDefault();
        }

        /// <summary>
        /// Extracts a sequence of prefixed names from an attribute.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public IEnumerable<XName> GetAttributePrefixedNames(string name)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));

            var attr = GetAttribute(name);
            if (attr == null)
                yield break;

            var value = attr.Value;
            if (string.IsNullOrEmpty(value))
                yield break;

            foreach (var v in value.Split(' '))
            {
                var i = v.IndexOf(':');
                if (i == -1)
                    yield return attr.Parent.Name.Namespace + v;

                var prefix = value.Substring(0, i + 1);
                if (string.IsNullOrWhiteSpace(prefix))
                    prefix = null;

                var suffix = value.Substring(i);
                if (string.IsNullOrWhiteSpace(suffix))
                    suffix = null;

                var ns = prefix != null ? attr.Parent.GetNamespaceOfPrefix(prefix) : attr.Parent.Name.Namespace;
                if (ns == null)
                    throw new Exception();

                yield return ns + suffix;
            }
        }

        /// <summary>
        /// Sets the XForms attribute of the specified name.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="value"></param>
        public void SetAttribute(string name, string value)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));
            if (value == null)
                throw new ArgumentNullException(nameof(value));

            throw new NotImplementedException();
        }

        /// <summary>
        /// Removes the XForms attribute of the specified name.
        /// </summary>
        /// <param name="name"></param>
        public void RemoveAttribute(string name)
        {
            if (name == null)
                throw new ArgumentNullException(nameof(name));

            throw new NotImplementedException();
        }

    }

}
