using System;
using System.Collections.Generic;
using System.Xml.Schema;

using NXKit.Xml.Schema;

namespace NXKit.XForms.Xml.Schema
{

    /// <summary>
    /// Provides access to the XForms schema.
    /// </summary>
    public static partial class Xsd
    {

        static readonly EmbeddedXmlHelper helper = new EmbeddedXmlHelper(new Uri("assembly://NXKit.XForms/NXKit/XForms/Xml/Schema/"));

        static Xsd()
        {
            helper.Add(NXKit.Xml.Schema.Xsd.Schemas);
            helper.Add(NXKit.XMLEvents.Xml.Schema.Xsd.Schemas);
            helper.Add(new Uri("XForms-Schema.xsd", UriKind.Relative));
        }

        /// <summary>
        /// Gets a reference to the XForms schema.
        /// </summary>
        public static IEnumerable<XmlSchema> Schemas => helper.Schemas;

    }

}
