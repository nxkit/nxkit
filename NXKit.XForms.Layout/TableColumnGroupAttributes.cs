using System;
using System.Xml.Linq;

namespace NXKit.XForms.Layout
{

    /// <summary>
    /// Provides the attributes for the 'table-column-group' element.
    /// </summary>
    [Extension("{http://schemas.nxkit.org/2014/xforms-layout}table-column-group")]
    public class TableColumnGroupAttributes :
        AttributeAccessor
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public TableColumnGroupAttributes(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

        public string Name
        {
            get { return GetAttributeValue("name"); }
        }

    }

}
