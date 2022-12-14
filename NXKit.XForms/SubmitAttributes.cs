using System;
using System.Xml.Linq;

namespace NXKit.XForms
{

    /// <summary>
    /// Provides the XForms 'submit' element.
    /// </summary>
    [Extension(typeof(SubmitAttributes), "{http://www.w3.org/2002/xforms}submit")]
    public class SubmitAttributes :
        AttributeAccessor
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public SubmitAttributes(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (element.Name != Constants.XForms + "submit")
                throw new ArgumentException("", nameof(element));
        }

        /// <summary>
        /// Gets the 'if' attribute values.
        /// </summary>
        public IdRef Submission
        {
            get { return GetAttributeValue("submission"); }
        }

    }

}