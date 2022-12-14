using System;
using System.Xml.Linq;

using NXKit.DOMEvents;
using NXKit.Scripting;
using NXKit.Xml;
using NXKit.XMLEvents;

namespace NXKit.XForms
{

    /// <summary>
    /// XForms 2.0 script tag.
    /// </summary>
    [Extension("{http://www.w3.org/2002/xforms}script")]
    [Remote]
    public class Script :
        ElementExtension,
        IEventHandler
    {

        readonly Lazy<IDocumentScript> documentScript;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        public Script(XElement element)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            this.documentScript = new Lazy<IDocumentScript>(() => element.Document.Interface<IDocumentScript>());
        }

        public string Type
        {
            get { return (string)Element.Attribute("type"); }
        }

        public string Src
        {
            get { return (string)Element.Attribute("src"); }
        }

        public string Charset
        {
            get { return (string)Element.Attribute("charset"); }
        }

        public void Invoke()
        {
            try
            {
                documentScript.Value.Execute(Type, Element.Value);
            }
            catch (ScriptException e)
            {
                throw new DOMTargetEventException(Element, Events.ActionError, e);
            }
        }

        public void HandleEvent(Event evt)
        {
            Invoke();
        }

    }

}
