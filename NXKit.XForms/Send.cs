using System;
using System.Linq;
using System.Xml.Linq;

using NXKit.DOMEvents;
using NXKit.Xml;
using NXKit.XMLEvents;

namespace NXKit.XForms
{

    [Extension("{http://www.w3.org/2002/xforms}send")]
    public class Send :
        ElementExtension,
        IEventHandler
    {

        readonly SendAttributes attributes;
        readonly Lazy<EvaluationContextResolver> context;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="attributes"></param>
        /// <param name="context"></param>
        public Send(
            XElement element,
            SendAttributes attributes,
            Lazy<EvaluationContextResolver> context)
            : base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            this.attributes = attributes ?? throw new ArgumentNullException(nameof(attributes));
            this.context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public void HandleEvent(Event ev)
        {
            Invoke();
        }

        /// <summary>
        /// Gets the targetted 'submission' interface.
        /// </summary>
        /// <returns></returns>
        XElement GetSubmission()
        {
            // Author-optional attribute containing a reference to element submission. If this attribute is given but
            // does not identify a submission element, then activating the submit does not result in the dispatch of
            // an xforms-submit event.
            if (attributes.Submission != null)
                return Element.ResolveId(attributes.Submission);

            // If this attribute is omitted, then the first submission in document order from the model associated with
            // the in-scope evaluation context is used.
            return context.Value.Context.Model.Element
                .Elements(Constants.XForms + "submission")
                .FirstOrDefault();
        }

        public void Invoke()
        {
            var submission = GetSubmission();
            if (submission == null)
                return;

            submission.DispatchEvent(Events.Submit);
        }

    }

}
