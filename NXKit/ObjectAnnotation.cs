using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

using NXKit.Serialization;

namespace NXKit
{

    /// <summary>
    /// Stores various NXKit information on the <see cref="XObject"/>.
    /// </summary>
    [SerializableAnnotation]
    public class ObjectAnnotation :
        IAttributeSerializableAnnotation
    {

        int id;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        public ObjectAnnotation()
            : this(0)
        {

        }

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="id"></param>
        internal ObjectAnnotation(int id)
        {
            this.id = id;
        }

        /// <summary>
        /// Gets the next available node ID.
        /// </summary>
        internal int Id
        {
            get { return id; }
        }

        IEnumerable<XAttribute> IAttributeSerializableAnnotation.Serialize(AnnotationSerializer serializer, XNamespace ns)
        {
            yield return new XAttribute(ns + "id", id);
        }

        void IAttributeSerializableAnnotation.Deserialize(AnnotationSerializer serializer, XNamespace ns, IEnumerable<XAttribute> attributes)
        {
            id = (int?)attributes.FirstOrDefault(i => i.Name == ns + "id") ?? 0;
        }

    }

}
