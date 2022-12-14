using System;
using System.Xml.Linq;

namespace NXKit.XForms
{

    /// <summary>
    /// Provides the XForms 'instance' attributes.
    /// </summary>
    [Extension(typeof(InstanceAttributes), "{http://www.w3.org/2002/xforms}instance")]
    public class InstanceAttributes :
        AttributeAccessor
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public InstanceAttributes(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

        /// <summary>
        /// Gets the 'if' attribute values.
        /// </summary>
        public string Src
        {
            get { return GetAttributeValue("src"); }
        }

    }

}