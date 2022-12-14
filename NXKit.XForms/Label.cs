using System;
using System.Xml.Linq;

namespace NXKit.XForms
{

    /// <summary>
    /// This element provides a descriptive label for the containing form control. The descriptive label can be
    /// presented visually and made available to accessibility software so the visually-impaired user can obtain a
    /// short description of form controls while navigating among them.
    /// </summary>
    [Extension("{http://www.w3.org/2002/xforms}label")]
    public class Label :
        ElementExtension
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public Label(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

    }

}
