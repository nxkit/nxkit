using System;
using System.Linq;
using System.Xml.Linq;

using NXKit.DOMEvents;
using NXKit.Xml;

namespace NXKit.XForms
{

    /// <summary>
    /// Encapsulates the binding information for an interface element.
    /// </summary>
    public class UIBinding
    {

        readonly XElement element;
        readonly IInvoker invoker;
        readonly Binding binding;
        readonly Lazy<UIBindingState> state;
        ModelItem modelItem;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="invoker"></param>
        public UIBinding(XElement element, IInvoker invoker)
        {
            this.element = element ?? throw new ArgumentNullException(nameof(element));
            this.invoker = invoker ?? throw new ArgumentNullException(nameof(invoker));
            this.state = new Lazy<UIBindingState>(() => element.AnnotationOrCreate<UIBindingState>());
        }

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="invoker"></param>
        internal UIBinding(XElement element, IInvoker invoker, ModelItem modelItem)
            : this(element, invoker)
        {
            this.modelItem = modelItem;
        }

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="invoker"></param>
        /// <param name="binding"></param>
        internal UIBinding(XElement element, IInvoker invoker, Binding binding)
            : this(element, invoker, binding.ModelItem)
        {
            this.binding = binding ?? throw new ArgumentNullException(nameof(binding));
        }

        /// <summary>
        /// Gets the model item associated with this binding.
        /// </summary>
        public ModelItem ModelItem
        {
            get { return modelItem; }
        }

        /// <summary>
        /// Gets the state of the binding.
        /// </summary>
        UIBindingState State
        {
            get { return state.Value; }
        }

        /// <summary>
        /// Gets the current data type of the interface.
        /// </summary>
        [Remote]
        public XName DataType
        {
            get { return State.DataType; }
        }

        /// <summary>
        /// Gets whether or not the interface is considered relevant.
        /// </summary>
        [Remote]
        public bool Relevant
        {
            get { return GetRelevant(); }
        }

        /// <summary>
        /// Implements the getter for Relevant.
        /// </summary>
        /// <returns></returns>
        bool GetRelevant()
        {
            if (State.Relevant == false)
                return false;

            var next = element.Ancestors()
                .Select(i => i.InterfaceOrDefault<IUIBindingNode>())
                .Where(i => i != null)
                .FirstOrDefault();
            if (next != null &&
                next.UIBinding != null)
                return next.UIBinding.Relevant;

            return true;
        }

        /// <summary>
        /// Gets whether or not the interface is considered read-only.
        /// </summary>
        [Remote]
        public bool ReadOnly
        {
            get { return State.ReadOnly; }
        }

        /// <summary>
        /// Gets whether or not the interface is considered required.
        /// </summary>
        [Remote]
        public bool Required
        {
            get { return State.Required; }
        }

        /// <summary>
        /// Gets whether or not the interface is considered valid.
        /// </summary>
        [Remote]
        public bool Valid
        {
            get { return State.Valid; }
        }

        /// <summary>
        /// Gets the current value of the interface.
        /// </summary>
        [Remote]
        public string Value
        {
            get { return State.Value; }
            set { SetValue(value); }
        }

        /// <summary>
        /// Implements the setter for Value.
        /// </summary>
        /// <param name="value"></param>
        void SetValue(string value)
        {
            invoker.Invoke(() =>
            {
                if (modelItem != null)
                    modelItem.Value = value ?? "";
            });
        }

        /// <summary>
        /// Refreshes all properties.
        /// </summary>
        public void Refresh()
        {
            var oldItemType = DataType;
            var oldRelevant = Relevant;
            var oldReadOnly = ReadOnly;
            var oldRequired = Required;
            var oldValid = Valid;
            var oldValue = Value;

            if (binding != null)
            {
                binding.Recalculate();

                if (modelItem != binding.ModelItem)
                    modelItem = binding.ModelItem;
            }

            if (modelItem != null)
            {
                State.DataType = modelItem.ItemType;
                State.Relevant = modelItem.Relevant;
                State.ReadOnly = modelItem.ReadOnly;
                State.Required = modelItem.Required;
                State.Valid = modelItem.Valid;
                State.Value = modelItem.Value;
            }
            else
            {
                // default values
                State.DataType = null;
                State.Relevant = true;
                State.ReadOnly = false;
                State.Required = false;
                State.Valid = true;
                State.Value = null;
            }

            // mark all required events
            var valueChanged = Value != oldValue;
            if (valueChanged)
            {
                State.DispatchValueChanged = true;
            }

            if (Relevant != oldRelevant || valueChanged)
            {
                if (Relevant)
                    State.DispatchEnabled = true;
                else
                    State.DispatchDisabled = true;
            }

            if (ReadOnly != oldReadOnly || valueChanged)
            {
                if (ReadOnly)
                    State.DispatchReadOnly = true;
                else
                    State.DispatchReadWrite = true;
            }

            if (Required != oldRequired || valueChanged)
            {
                if (Required)
                    State.DispatchRequired = true;
                else
                    State.DispatchOptional = true;
            }

            if (Valid != oldValid || valueChanged)
            {
                if (Valid)
                    State.DispatchValid = true;
                else
                    State.DispatchInvalid = true;
            }
        }

        /// <summary>
        /// Dispatches all pending events.
        /// </summary>
        public void DispatchEvents()
        {
            var target = element.Interface<EventTarget>();
            if (target == null)
                return;

            if (State.DispatchValueChanged)
            {
                State.DispatchValueChanged = false;
                target.Dispatch(Events.ValueChanged);
            }

            if (State.DispatchValid)
            {
                State.DispatchValid = false;
                target.Dispatch(Events.Valid);
            }

            if (State.DispatchInvalid)
            {
                State.DispatchInvalid = false;
                target.Dispatch(Events.Invalid);
            }

            if (State.DispatchEnabled)
            {
                State.DispatchEnabled = false;
                target.Dispatch(Events.Enabled);
            }

            if (State.DispatchDisabled)
            {
                State.DispatchDisabled = false;
                target.Dispatch(Events.Disabled);
            }

            if (State.DispatchOptional)
            {
                State.DispatchOptional = false;
                target.Dispatch(Events.Optional);
            }

            if (State.DispatchRequired)
            {
                State.DispatchRequired = false;
                target.Dispatch(Events.Required);
            }

            if (State.DispatchReadOnly)
            {
                State.DispatchReadOnly = false;
                target.Dispatch(Events.ReadOnly);
            }

            if (State.DispatchReadWrite)
            {
                State.DispatchReadWrite = false;
                target.Dispatch(Events.ReadWrite);
            }
        }

        /// <summary>
        /// Discards all pending events.
        /// </summary>
        public void DiscardEvents()
        {
            State.DispatchValueChanged = false;
            State.DispatchValid = false;
            State.DispatchInvalid = false;
            State.DispatchEnabled = false;
            State.DispatchDisabled = false;
            State.DispatchOptional = false;
            State.DispatchRequired = false;
            State.DispatchReadOnly = false;
            State.DispatchReadWrite = false;
        }

    }

}
