using System;
using System.Xml.Linq;

namespace NXKit.XForms
{

    /// <summary>
    /// Provides the standard XForms binding attributes.
    /// </summary>
    [Extension(typeof(BindingAttributes))]
    public class BindingAttributes :
        AttributeAccessor
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public BindingAttributes(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

        /// <summary>
        /// Gets the 'ref' attribute values.
        /// </summary>
        public string Ref
        {
            get { return GetAttributeValue("ref"); }
        }

        /// <summary>
        /// Gets the 'nodeset' attribute values.
        /// </summary>
        public string NodeSet
        {
            get { return GetAttributeValue("nodeset"); }
        }

        /// <summary>
        /// Gets the 'bind' attribute value.
        /// </summary>
        public string Bind
        {
            get { return GetAttributeValue("bind"); }
        }

    }

}