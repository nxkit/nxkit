using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

using NXKit.Composition;
using NXKit.Diagnostics;
using NXKit.DOMEvents;
using NXKit.Serialization;
using NXKit.Xml;

namespace NXKit.XForms
{

    [Extension("{http://www.w3.org/2002/xforms}repeat")]
    [Remote]
    public class Repeat :
        ElementExtension,
        IOnInit,
        IOnRefresh
    {

        readonly AnnotationSerializer serializer;
        readonly ITraceService trace;
        readonly RepeatAttributes attributes;
        readonly IExport<IBindingNode> bindingNode;
        readonly Lazy<Binding> binding;
        readonly IExport<IUIBindingNode> uiBindingNode;
        readonly Lazy<UIBinding> uiBinding;
        readonly Lazy<RepeatState> state;
        readonly Lazy<XElement> template;

        IEventListener listener;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="attributes"></param>
        /// <param name="bindingNode"></param>
        /// <param name="uiBindingNode"></param>
        /// <param name="serializer"></param>
        /// <param name="trace"></param>
        public Repeat(
            XElement element,
            RepeatAttributes attributes,
            IExport<IBindingNode> bindingNode,
            IExport<IUIBindingNode> uiBindingNode,
            AnnotationSerializer serializer,
            ITraceService trace) :
            base(element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            this.serializer = serializer ?? throw new ArgumentNullException(nameof(serializer));
            this.trace = trace ?? throw new ArgumentNullException(nameof(trace));
            this.attributes = attributes ?? throw new ArgumentNullException(nameof(attributes));
            this.bindingNode = bindingNode ?? throw new ArgumentNullException(nameof(bindingNode));
            this.uiBindingNode = uiBindingNode ?? throw new ArgumentNullException(nameof(uiBindingNode));

            binding = new Lazy<Binding>(() => bindingNode.Value.Binding);
            uiBinding = new Lazy<UIBinding>(() => uiBindingNode.Value.UIBinding);
            state = new Lazy<RepeatState>(() => Element.AnnotationOrCreate<RepeatState>());
            template = new Lazy<XElement>(() => State.Template);
        }

        RepeatState State
        {
            get { return state.Value; }
        }

        UIBinding UIBinding
        {
            get { return uiBinding.Value; }
        }

        Binding Binding
        {
            get { return binding.Value; }
        }

        /// <summary>
        /// Gets or sets the current repeat index.
        /// </summary>
        [Remote]
        public int Index
        {
            get { return State.Index; }
            set { State.Index = value; }
        }

        /// <summary>
        /// Gets or sets the persisted template.
        /// </summary>
        XElement Template
        {
            get { return State.Template; }
            set { State.Template = value; }
        }

        /// <summary>
        /// Invoked once when the element comes into scope.
        /// </summary>
        public void Init()
        {
            // acquire template
            Template = new XElement(
                Constants.XForms + "template",
                Element.GetNamespacePrefixAttributes(),
                Element.Nodes());
            if (Template == null)
                throw new InvalidOperationException("Unable to initialize Template.");

            // clear out existing body
            Element.RemoveNodes();
        }

        /// <summary>
        /// Dynamically generate repeat items, reusing existing instances if available.
        /// </summary>
        /// <returns></returns>
        public void Update()
        {
            if (Template == null)
                throw new InvalidOperationException("Template not yet initialized. Init phase not executed.");

            // refresh binding
            if (Binding != null)
                Binding.Recalculate();

            // configure listener for instance alterations
            if (Binding != null &&
                Binding.Context != null)
                if (listener == null)
                {
                    var target = Binding.Context.Instance.Element.Parent.Interface<EventTarget>();

                    // find existing listener
                    listener =
                        InterfaceEventListener.GetListener(target, Events.Insert, true, Update) ??
                        InterfaceEventListener.GetListener(target, Events.Delete, true, Update);

                    // register listener
                    if (listener == null)
                    {
                        listener = InterfaceEventListener.Create(Update);
                        target.Register(Events.Insert, listener, true);
                        target.Register(Events.Delete, listener, true);
                    }
                }

            // store current index item
            var indexPrev = Index;
            var indexItem = Element
                .Elements()
                .FirstOrDefault(i => i.AnnotationOrCreate<RepeatItemState>().Index == Index);

            // build new list of properly ordered nodes
            var items = Binding != null ? Binding.ModelItems.Select(i => i.Xml).ToArray() : new XObject[0];
            var nodes = Element.Elements().ToArray();
            var sorts = new XElement[items.Length];
            for (int index = 0; index < items.Length; index++)
            {
                // model item at current index
                var item = items[index];

                // get existing item or create new
                var indx = Array.FindIndex(nodes, i => i.AnnotationOrCreate<RepeatItemState>().ModelObjectId == item.GetObjectId());
                var node = indx >= 0 ? nodes[indx] : null;
                if (node == null)
                    node = new XElement(
                        Constants.XForms + "group",
                        Template.GetNamespacePrefixAttributes(),
                        Template.Nodes());

                // set node into output list
                sorts[index] = node;

                // configure item state
                var anno = node.AnnotationOrCreate<RepeatItemState>();
                anno.ModelObjectId = item.GetObjectId();
                anno.Index = index + 1;
                anno.Size = items.Length;
            }

            // new sequence is different from old sequence
            if (sorts.Length != nodes.Length ||
                sorts.SequenceEqual(nodes) == false)
            {
                // replace all children
                Element.RemoveNodes();
                Element.Add(sorts);

                // set of elements that were added
                var added = sorts
                    .Except(nodes)
                    .ToArray();

                // model-construct-done sequence applied to new children
                foreach (var node in added)
                    foreach (var i in GetAllExtensions<IOnRefresh>(node))
                        i.RefreshBinding();

                // discard refresh events
                foreach (var node in added)
                    foreach (var i in GetAllExtensions<IOnRefresh>(node))
                        i.DiscardEvents();

                // final refresh
                foreach (var node in added)
                    foreach (var i in GetAllExtensions<IOnRefresh>(node))
                        i.Refresh();
            }

            // restore or reset index
            var length = Element.Elements().Count();
            if (indexItem != null &&
                indexItem.Parent != null)
                Index = indexItem.AnnotationOrCreate<RepeatItemState>().Index;
            else if (indexPrev > 0)
                Index = indexPrev <= length ? indexPrev : length;
            else if (length > 0)
                Index = 1;
            else
                Index = 0;
        }

        /// <summary>
        /// Gets all implementations of the given extension type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        IEnumerable<T> GetAllExtensions<T>(XElement root)
            where T : class, IExtension
        {
            if (root == null)
                throw new ArgumentNullException(nameof(root));

            return root
                .DescendantNodesAndSelf()
                .SelectMany(i => i.Interfaces<T>());
        }

        /// <summary>
        /// Gets the <see cref="EvaluationContext"/> for a specific item.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        internal EvaluationContext GetItemContext(XElement element)
        {
            var item = element.Annotation<RepeatItemState>();
            if (item == null)
                throw new InvalidOperationException();

            if (Binding == null ||
                Binding.ModelItems.Length == 0)
                return null;

            var xml = Binding.ModelItem.Instance.State.Document.ResolveObjectId(item.ModelObjectId);
            if (xml == null)
            {
                var d = serializer.Serialize(Binding.ModelItem.Instance.State.Document);
                var s = d.ToString();
                var l = Binding.ModelItem.Instance.State.Document.ToString();
                throw new InvalidOperationException();
            }

            return new EvaluationContext(
                ModelItem.Get(xml, trace),
                item.Index,
                item.Size);
        }

        void IOnRefresh.RefreshBinding()
        {

        }

        void IOnRefresh.Refresh()
        {
            Update();
        }

        void IOnRefresh.DispatchEvents()
        {

        }

        void IOnRefresh.DiscardEvents()
        {

        }


    }

}
