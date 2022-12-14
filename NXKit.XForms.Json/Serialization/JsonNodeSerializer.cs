using System;
using System.IO;
using System.Linq;
using System.Xml.Linq;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using NXKit.Composition;
using NXKit.IO.Media;
using NXKit.XForms.Serialization;

namespace NXKit.XForms.Json.Serialization
{

    [Export(typeof(IModelSerializer))]
    public class JsonNodeSerializer :
        IModelSerializer
    {

        static readonly MediaRange[] MEDIA_RANGE = new MediaRange[]
        {
            "application/json",
            "text/json"
        };

        public Priority CanSerialize(XNode node, MediaRange mediaType)
        {
            return MEDIA_RANGE.Any(i => i.Matches(mediaType)) && (node is XDocument || node is XElement) ? Priority.Default : Priority.Ignore;
        }

        public void Serialize(TextWriter writer, XNode node, MediaRange mediaType)
        {
            using (var json = new JsonTextWriter(writer))
                ToJObject(node).WriteTo(json);
        }

        JObject ToJObject(XObject obj)
        {
            throw new NotImplementedException();
        }

    }

}
