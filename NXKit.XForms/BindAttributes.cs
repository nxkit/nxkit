using System;
using System.Xml.Linq;

namespace NXKit.XForms
{

    /// <summary>
    /// Provides the attributes for the bind element.
    /// </summary>
    [Extension(typeof(BindAttributes), "{http://www.w3.org/2002/xforms}bind")]
    public class BindAttributes :
        CommonAttributes
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public BindAttributes(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

        public string Type
        {
            get { return GetAttributeValue("type"); }
        }

        public string Calculate
        {
            get { return GetAttributeValue("calculate"); }
        }

        public string ReadOnly
        {
            get { return GetAttributeValue("readonly"); }
        }

        public string Required
        {
            get { return GetAttributeValue("required"); }
        }

        public string Relevant
        {
            get { return GetAttributeValue("relevant"); }
        }

        public string Constraint
        {
            get { return GetAttributeValue("constraint"); }
        }

        public string P3PType
        {
            get { return GetAttributeValue("p3ptype"); }
        }

    }

}
