using System.Collections.Generic;

using NXKit.Composition;

namespace NXKit.DOMEvents
{

    [Export(typeof(IEventInfoTable))]
    public partial class Events :
        IEventInfoTable
    {

        public IEnumerable<EventInfo> GetEventInfos()
        {
            return EVENT_INFO;
        }

    }

}
