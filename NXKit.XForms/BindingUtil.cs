using System;
using System.Xml.Linq;

using NXKit.Diagnostics;
using NXKit.DOMEvents;
using NXKit.Xml;

namespace NXKit.XForms
{

    /// <summary>
    /// Provides utility methods for <see cref="Binding"/> operation.
    /// </summary>
    public static class BindingUtil
    {

        /// <summary>
        /// Returns a new <see cref="Binding"/> instance for the specified element and expression.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="xpath"></param>
        /// <returns></returns>
        public static Binding ForElement(XElement element, string xpath, ITraceService trace)
        {
            if (trace is null)
                throw new ArgumentNullException(nameof(trace));
            if (element is null)
                throw new ArgumentNullException(nameof(element));

            // ignore empty expressions
            if (xpath == null ||
                xpath == "")
                return null;

            var resolver = element.InterfaceOrDefault<EvaluationContextResolver>();
            if (resolver == null)
                throw new DOMTargetEventException(element, Events.BindingException,
                    "Missing EvaluationContextResolver interface.");

            var context = resolver.Context;
            if (context == null)
                throw new DOMTargetEventException(element, Events.BindingException,
                    "Missing EvaluationContextResolver Context.");

            return new Binding(element, context, xpath, trace);
        }

        /// <summary>
        /// Returns a new <see cref="Binding"/> instance for the specified element and expression.
        /// </summary>
        /// <param name="attribute"></param>
        /// <param name="trace"></param>
        /// <returns></returns>
        public static Binding ForAttribute(XAttribute attribute, ITraceService trace)
        {
            if (trace is null)
                throw new ArgumentNullException(nameof(trace));

            // ignore empty attributes
            if (attribute == null ||
                attribute.Value == null ||
                attribute.Value == "")
                return null;

            var resolver = attribute.InterfaceOrDefault<EvaluationContextResolver>();
            if (resolver == null)
                throw new DOMTargetEventException(attribute.Parent, Events.BindingException,
                    "Missing EvaluationContextResolver interface.");

            var context = resolver.Context;
            if (context == null)
                throw new DOMTargetEventException(attribute.Parent, Events.BindingException,
                    "Missing EvaluationContextResolver Context.");

            return new Binding(attribute.Parent, context, attribute.Value, trace);
        }

    }
}
