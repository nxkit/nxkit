

namespace NXKit.DOMEvents
{

    public partial class Events
    {
    
        static readonly EventInfo[] EVENT_INFO = new EventInfo[]
        {
            new EventInfo("load", false, false),
            new UIEventInfo("DOMActivate", true, true),
            new MutationEventInfo("DOMSubtreeModified", true, false),
            new MutationEventInfo("DOMNodeInserted", true, false),
            new MutationEventInfo("DOMNodeInsertedIntoDocument", false, false),
            new MutationEventInfo("DOMNodeRemoved", true, false),
            new MutationEventInfo("DOMNodeRemovedFromDocument", false, false),
            new MutationEventInfo("DOMAttrModified", true, false),
            new MutationEventInfo("DOMCharacterDataModified", true, false),
            new MutationEventInfo("DOMElementNameChanged", true, false),
            new MutationEventInfo("DOMAttributeNameChanged", true, false),
            new FocusEventInfo("DOMFocusIn", true, false),
            new FocusEventInfo("DOMFocusOut", true, false),
        };

        public const string Load = "load";

        public const string DOMActivate = "DOMActivate";

        public const string DOMSubtreeModified = "DOMSubtreeModified";
        public const string DOMNodeInserted = "DOMNodeInserted";
        public const string DOMNodeInsertedIntoDocument = "DOMNodeInsertedIntoDocument";
        public const string DOMNodeRemoved = "DOMNodeRemoved";
        public const string DOMNodeRemovedFromDocument = "DOMNodeRemovedFromDocument";
        public const string DOMAttrModified = "DOMAttrModified";
        public const string DOMCharacterDataModified = "DOMCharacterDataModified";
        public const string DOMElementNameChanged = "DOMElementNameChanged";
        public const string DOMAttributeNameChanged = "DOMAttributeNameChanged";

        public const string DOMFocusIn = "DOMFocusIn";
        public const string DOMFocusOut = "DOMFocusOut";

    }

}