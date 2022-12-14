using System;
using System.Xml.Linq;

namespace NXKit.XForms.Layout
{

    /// <summary>
    /// Provides the attributes for the 'table-column-group' element.
    /// </summary>
    public class AttributeAccessor :
        NXKit.XForms.AttributeAccessor
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public AttributeAccessor(XElement element)
            : base(element, Constants.Layout_1_0)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

    }

}
