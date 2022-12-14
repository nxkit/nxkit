using System;
using System.Xml.Linq;

namespace NXKit.XForms
{

    /// <summary>
    /// The author-optional element help provides a convenient way to attach help information to a form control.
    /// </summary>
    [Extension("{http://www.w3.org/2002/xforms}help")]
    public class Help :
        ElementExtension
    {

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public Help(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
        }

    }

}
