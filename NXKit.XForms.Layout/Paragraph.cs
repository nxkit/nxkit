using System;
using System.Xml.Linq;

namespace NXKit.XForms.Layout
{

    [Extension("{http://schemas.nxkit.org/2014/xforms-layout}p")]
    public class Paragraph :
        ElementExtension
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public Paragraph(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

    }

}
