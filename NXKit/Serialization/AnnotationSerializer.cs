using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

using NXKit.Composition;
using NXKit.Xml;

namespace NXKit.Serialization
{

    /// <summary>
    /// Provides methods to serialize or deserialize an XLinq object graph including annotations.
    /// </summary>
    [Export(typeof(AnnotationSerializer))]
    public class AnnotationSerializer
    {

        internal static readonly XNamespace NX_NS = "http://schemas.nxkit.org/2014/serialization";
        internal static readonly XName NX_ANNOTATION = NX_NS + "annotation";
        internal static readonly XName NX_FOR = "for";
        internal const string NX_FOR_DOCUMENT = "document";
        internal const string NX_FOR_ELEMENT = "element";
        internal const string NX_FOR_ATTRIBUTE = "attribute";
        internal const string NX_FOR_NODE = "node";
        internal static readonly XName NX_ATTRIBUTE = "attribute";
        internal static readonly XName NX_FORMAT = "format";
        internal const string NX_FORMAT_XML = "xml";
        internal const string NX_FORMAT_BINARY = "binary";
        internal static readonly XName NX_TYPE = "type";

        static readonly ConcurrentDictionary<Type, XmlSerializer> cache = new ConcurrentDictionary<Type, XmlSerializer>();

        /// <summary>
        /// Gets the <see cref="XmlSerializer"/> instance for the given type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        static XmlSerializer GetXmlSerializer(Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            return cache.GetOrAdd(type, i => new XmlSerializer(i));
        }

        #region Serialize

        /// <summary>
        /// Serializes a normal <see cref="XNode"/> into a new <see cref="XNode"/>, integrating the annotations.
        /// </summary>
        /// <param name="node"></param>
        /// <returns></returns>
        public XNode Serialize(XNode node)
        {
            if (node == null)
                throw new ArgumentNullException(nameof(node));

            if (node is XDocument)
                return Serialize((XDocument)node);
            if (node is XElement)
                return Serialize((XElement)node);

            throw new InvalidOperationException();
        }

        /// <summary>
        /// Serializes a normal <see cref="XElement"/> into a new <see cref="XElement"/>, integrating the annotations.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        public XElement Serialize(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            return new XElement(element.Name, SerializeContents(element));
        }

        /// <summary>
        /// Serialize a normal <see cref="XDocument"/> into a new <see cref="XDocument"/>, integrating the annotations
        /// into the elements.
        /// </summary>
        /// <param name="document"></param>
        /// <returns></returns>
        public XDocument Serialize(XDocument document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));

            return new XDocument(SerializeContents(document));
        }

        /// <summary>
        /// Gets the contents of the given <see cref="XDocument"/>.
        /// </summary>
        /// <param name="document"></param>
        /// <returns></returns>
        IEnumerable<object> SerializeContents(XDocument document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));

            if (document.DocumentType != null)
                yield return document.DocumentType;

            foreach (var node in document.Nodes())
                if (node is XElement)
                    // replace original element with annotating element.
                    yield return new XStreamingElement(((XElement)node).Name, SerializeContents((XElement)node));
                else
                    yield return node;
        }

        /// <summary>
        /// Gets the contents of the specified <see cref="XElement"/>.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        IEnumerable<object> SerializeContents(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            // produces attributes of element
            foreach (var attr in element.Attributes())
                yield return attr;

            // produces additional attributes by attribute serializers
            foreach (var attr in GetSerializationAttributes(element))
                if (attr != null)
                    yield return attr;

            // produce saved data of element
            foreach (var save in GetSerializationBody(element))
                if (save != null)
                    yield return save;

            // produce nodes of element
            foreach (var node in element.Nodes())
                if (node is XElement)
                    // replace original element with annotating element.
                    yield return new XStreamingElement(((XElement)node).Name, SerializeContents((XElement)node));
                else
                {
                    // other node types
                    yield return node;

                    foreach (var save in SerializeObject(node))
                        yield return save;
                }
        }

        /// <summary>
        /// Gets the saved state of the <see cref="XElement"/> which supports serializing to attributes.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        IEnumerable<XAttribute> GetSerializationAttributes(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            // emit annotations configured on the object itself
            foreach (var annotation in element.Annotations<IAttributeSerializableAnnotation>())
                foreach (var attribute in SerializeAttributeAnnotation(element, annotation))
                    yield return attribute;
        }

        /// <summary>
        /// Gets the <see cref="XAttribute"/> stream for the given attribute serializer.
        /// </summary>
        /// <param name="element"></param>
        /// <param name="annotation"></param>
        /// <returns></returns>
        IEnumerable<XAttribute> SerializeAttributeAnnotation(XElement element, IAttributeSerializableAnnotation annotation)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));

            // check for supported attribution
            var type = annotation.GetType();
            var attr = type.GetCustomAttribute<SerializableAnnotationAttribute>();
            if (attr == null)
                yield break;

            // require public type
            if (!(type.IsPublic || type.IsNestedPublic))
                yield break;

            // disallow abstract
            if (type.IsAbstract)
                yield break;

            // find default constructor
            var ctor = type.GetConstructor(Type.EmptyTypes);
            if (ctor == null)
                yield break;

            // serialize object and emit attributes
            foreach (var attr2 in annotation.Serialize(this, $"nx-annotation:{annotation.GetType().FullName};{annotation.GetType().Assembly.GetName().Name}"))
                yield return attr2;
        }

        /// <summary>
        /// Gets the saved state of the <see cref="XElement"/>.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        IEnumerable<object> GetSerializationBody(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            if (element == element.Document.Root)
            {
                // add annotation namespace to root element to prevent duplication
                yield return new XAttribute(XNamespace.Xmlns + "nx", NX_NS);

                // attach annotation for the document to the root element
                foreach (var i in SerializeObject(element.Document))
                    if (i != null)
                        yield return i;
            }

            // yield annotations for the element itself
            foreach (var i in SerializeObject(element))
                if (i != null)
                    yield return i;
        }

        /// <summary>
        /// Produces a series of <see cref="XElement"/> nodes which describe annotation data for the specified <see
        /// cref="XObject"/>.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        IEnumerable<XElement> SerializeObject(XObject obj)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            if (obj is XDocument document)
                return SerializeDocument(document);

            // object is an element
            if (obj is XElement element)
                return SerializeElement(element);

            // object is attribute
            if (obj is XAttribute attribute)
                return SerializeAttribute(attribute);

            if (obj is XNode node)
                return SerializeNode(node);

            return null;
        }

        /// <summary>
        /// Gets the annotation elements for a <see cref="XDocument"/>.
        /// </summary>
        /// <param name="document"></param>
        /// <returns></returns>
        IEnumerable<XElement> SerializeDocument(XDocument document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));

            // emit annotations configured on the object itself
            foreach (var annotation in document.Annotations<object>())
            {
                var obj = SerializeAnnotation(document, annotation);
                if (obj != null)
                {
                    obj.SetAttributeValue(NX_FOR, NX_FOR_DOCUMENT);
                    yield return obj;
                }
            }
        }

        /// <summary>
        /// Gets the annotation elements for a <see cref="XElement"/>.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        IEnumerable<XElement> SerializeElement(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            // emit annotations configured on the object itself
            foreach (var annotation in element.Annotations<object>())
            {
                var obj = SerializeAnnotation(element, annotation);
                if (obj != null)
                {
                    obj.SetAttributeValue(NX_FOR, NX_FOR_ELEMENT);
                    yield return obj;
                }
            }

            // emit annotations on the attributes
            foreach (var attribute in element.Attributes())
                foreach (var i in SerializeAttribute(attribute))
                    yield return i;
        }

        /// <summary>
        /// Gets the annotation elements for a <see cref="XAttribute"/>.
        /// </summary>
        /// <param name="attribute"></param>
        /// <returns></returns>
        IEnumerable<XElement> SerializeAttribute(XAttribute attribute)
        {
            if (attribute == null)
                throw new ArgumentNullException(nameof(attribute));

            // skip namespace attribute
            if (attribute.IsNamespaceDeclaration)
                yield break;

            // emit annotations on the attribute
            foreach (var annotation in attribute.Annotations<object>())
            {
                var obj = SerializeAnnotation(attribute, annotation);
                if (obj != null)
                {
                    obj.SetAttributeValue(NX_FOR, NX_FOR_ATTRIBUTE);
                    yield return obj;
                }
            }
        }

        /// <summary>
        /// Gets the annotation elements for a <see cref="XNode"/>.
        /// </summary>
        /// <param name="node"></param>
        /// <returns></returns>
        IEnumerable<XElement> SerializeNode(XNode node)
        {
            if (node == null)
                throw new ArgumentNullException(nameof(node));

            foreach (var annotation in node.Annotations<object>())
            {
                var obj = SerializeAnnotation(node, annotation);
                if (obj != null)
                {
                    obj.SetAttributeValue(NX_FOR, NX_FOR_NODE);
                    yield return obj;
                }
            }
        }

        /// <summary>
        /// Gets an element which described the serialized annotation on the given <see cref="XObject"/>.
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="annotation"></param>
        /// <returns></returns>
        XElement SerializeAnnotation(XObject obj, object annotation)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));

            return SerializeToXml(obj, annotation);
        }

        /// <summary>
        /// Attempts to serialize the annotation as XML.
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="annotation"></param>
        /// <returns></returns>
        XElement SerializeToXml(XObject obj, object annotation)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));

            // check for supported attribution
            var type = annotation.GetType();
            var attr = type.GetCustomAttribute<SerializableAnnotationAttribute>();
            if (attr == null)
                return null;

            // require public type
            if (!(type.IsPublic || type.IsNestedPublic))
                return null;

            // disallow abstract
            if (type.IsAbstract)
                return null;

            // find default constructor
            var ctor = type.GetConstructor(Type.EmptyTypes);
            if (ctor == null)
                return null;

            return SerializeToXml(obj, annotation, CreateAnnotationElement(obj, annotation));
        }

        /// <summary>
        /// Serializes the annotation as XML to the body of hte given element.
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="annotation"></param>
        /// <param name="element"></param>
        XElement SerializeToXml(XObject obj, object annotation, XElement element)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            // configure element
            element.SetAttributeValue(NX_FORMAT, NX_FORMAT_XML);
            element.SetAttributeValue(NX_TYPE, annotation.GetType().FullName + ", " + annotation.GetType().Assembly.GetName().Name);
            element.RemoveNodes();

            if (annotation is IAttributeSerializableAnnotation)
            {
                // an attribute serializable has no body for an element
                var eobj = obj as XElement;
                if (eobj == null)
                {
                    var ns = $"nx-annotation:{annotation.GetType().FullName};{annotation.GetType().Assembly.GetName().Name}";
                    var attrs = ((IAttributeSerializableAnnotation)annotation).Serialize(this, ns);
                    if (attrs == null)
                        return null;

                    element.Add(attrs);
                    return element;
                }
            }
            else if (annotation is ISerializableAnnotation)
            {
                var serialized = ((ISerializableAnnotation)annotation).Serialize(this);
                if (serialized == null)
                    return null;

                element.Add(serialized);
                return element;
            }
            else if (annotation is IXmlSerializable)
            {
                using (var wrt = element.CreateWriter())
                {
                    wrt.WriteWhitespace("");
                    var srs = GetXmlSerializer(annotation.GetType());
                    var ens = new XmlSerializerNamespaces();
                    ens.Add("", "");
                    srs.Serialize(wrt, annotation, ens);
                    return element;
                }
            }
            else if (annotation.GetType().GetCustomAttribute<XmlRootAttribute>() != null)
            {
                using (var wrt = element.CreateWriter())
                {
                    var srs = GetXmlSerializer(annotation.GetType());
                    var ens = new XmlSerializerNamespaces();
                    ens.Add("", "");
                    srs.Serialize(wrt, annotation, ens);
                    return element;
                }
            }

            return null;
        }

        /// <summary>
        /// Creates a new <see cref="XElement"/> for holding the specified annotation.
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="annotation"></param>
        /// <returns></returns>
        static XElement CreateAnnotationElement(XObject obj, object annotation)
        {
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));

            if (obj is XDocument)
                return new XElement(NX_ANNOTATION,
                    new XAttribute(XNamespace.Xmlns + "nx", NX_NS),
                    new XAttribute(NX_FOR_ELEMENT, NX_FOR_DOCUMENT));

            if (obj is XElement)
                return new XElement(NX_ANNOTATION,
                    new XAttribute(XNamespace.Xmlns + "nx", NX_NS),
                    new XAttribute(NX_FOR, NX_FOR_ELEMENT));

            if (obj is XAttribute)
                return new XElement(NX_ANNOTATION,
                    new XAttribute(NX_FOR, NX_FOR_ATTRIBUTE),
                    new XAttribute(XNamespace.Xmlns + "nx", NX_NS),
                    new XAttribute(NX_ATTRIBUTE, ((XAttribute)obj).Name));

            if (obj is XNode)
                return new XElement(NX_ANNOTATION,
                    new XAttribute(XNamespace.Xmlns + "nx", NX_NS),
                    new XAttribute(NX_FOR, NX_FOR_NODE));

            // cannot serialize unknown object type
            throw new InvalidOperationException();
        }

        #endregion

        #region Deserialize

        /// <summary>
        /// Deserialize a <see cref="XDocument"/> which includes integrated annotations into a new <see
        /// cref="XDocument"/> with applied annotations.
        /// </summary>
        /// <param name="document"></param>
        /// <returns></returns>
        public XDocument Deserialize(XDocument document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));

            // copy element and deserialize contents 
            var xml = new XDocument(document);

            // document being read expresses a base URI, set on element
            if (!string.IsNullOrEmpty(document.BaseUri))
                xml.SetBaseUri(document.BaseUri);

            // apply serialied contents
            DeserializeDocument(xml);

            // strip out NX namespaces
            xml.Root.DescendantsAndSelf()
                .SelectMany(i => i.Attributes())
                .Where(i => i.IsNamespaceDeclaration)
                .Where(i => i.Value == NX_NS)
                .Remove();

            // strip out nx-annotation namespaces
            xml.Root.DescendantsAndSelf()
                .SelectMany(i => i.Attributes())
                .Where(i => i.IsNamespaceDeclaration)
                .Where(i => i.Value.StartsWith("nx-annotation:"))
                .Remove();

            // strip out unsupported processing instructions
            xml.DescendantNodesAndSelf()
                .OfType<XProcessingInstruction>()
                .Where(i => i.NodeType != XmlNodeType.XmlDeclaration)
                .Remove();

            return xml;
        }

        /// <summary>
        /// Deserializes the contents of the <see cref="XDocument"/>.
        /// </summary>
        /// <param name="document"></param>
        void DeserializeDocument(XDocument document)
        {
            if (document == null)
                throw new ArgumentNullException(nameof(document));

            // deserializes the entire document hierarchy
            foreach (var element in document.Descendants())
                DeserializeElement(element);
        }

        /// <summary>
        /// Deserializes the contents of the <see cref="XElement"/>.
        /// </summary>
        /// <param name="element"></param>
        void DeserializeElement(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            // deserializes attribute annotations onto the element
            if (element.Name != NX_ANNOTATION)
                DeserializeAttributeAnnotations(element);

            // extract annotation elements
            var annotations = element
                .Elements(NX_ANNOTATION)
                .ToList();

            // deserialize each annotation element
            foreach (var annotation in annotations)
                DeserializeAnnotationElement(element, annotation);

            // remove annotations from element
            annotations.Remove();
        }

        /// <summary>
        /// Deserializes all the attribute annotations.
        /// </summary>
        /// <param name="element"></param>
        void DeserializeAttributeAnnotations(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            // finds all nx-annotation namespaces for attribute serializers
            var namespaces = element
                .Attributes()
                .Where(i => i.Name.NamespaceName.StartsWith("nx-annotation:"))
                .GroupBy(i => i.Name.NamespaceName)
                .ToList();

            // evaluate each discovered annotation attribute
            foreach (var attrs in namespaces)
            {
                var text = attrs.Key.Split(':', ';');
                if (text.Length != 3)
                    throw new InvalidOperationException();

                // resolve type from text
                var type = Type.GetType(text[1] + ", " + text[2]);
                if (type == null)
                    throw new InvalidOperationException();

                // specified type is an attribute serializable
                if (typeof(IAttributeSerializableAnnotation).IsAssignableFrom(type))
                {
                    var ns = string.Format(
                        "nx-annotation:{0};{1}",
                        type.FullName,
                        type.Assembly.GetName().Name);

                    var obj = (IAttributeSerializableAnnotation)Activator.CreateInstance(type);
                    obj.Deserialize(this, ns, attrs);
                    element.AddAnnotation(obj);
                }

                attrs.Remove();
            }
        }

        /// <summary>
        /// Deserializes the specified annotation element and applies it to the given target element.
        /// </summary>
        /// <param name="element">The parent element of the annotation node.</param>
        /// <param name="annotation">The annotation element.</param>
        void DeserializeAnnotationElement(XElement element, XElement annotation)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));

            // deserialize anotation data
            var obj = DeserializeAnnotationElement(annotation);
            if (obj == null)
                return;

            // annotation specifies how it should be applied
            switch ((string)annotation.Attribute(NX_FOR))
            {
                case NX_FOR_DOCUMENT:
                    ApplyAnnotationToDocument(element, annotation, obj);
                    break;
                case NX_FOR_ELEMENT:
                    ApplyAnnotationToElement(element, annotation, obj);
                    break;
                case NX_FOR_ATTRIBUTE:
                    ApplyAnnotationToAttribute(element, annotation, obj);
                    break;
                case NX_FOR_NODE:
                    ApplyAnnotationToNode(element, annotation, obj);
                    break;
                default:
                    throw new InvalidOperationException();
            }
        }

        /// <summary>
        /// Deserializes the specified annotation element.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        object DeserializeAnnotationElement(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            switch ((string)element.Attribute(NX_FORMAT))
            {
                case NX_FORMAT_XML:
                    return DeserializeAnnotationFromXml(element);
            }

            throw new InvalidOperationException();
        }

        /// <summary>
        /// Deserializes the specified annotation element stored as XML.
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        object DeserializeAnnotationFromXml(XElement element)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));

            var typeName = (string)element.Attribute(NX_TYPE);
            if (typeName == null)
                throw new InvalidOperationException();

            var type = Type.GetType(typeName);
            if (type == null)
                throw new InvalidOperationException();

            // serialize anntation into body
            if (typeof(IAttributeSerializableAnnotation).IsAssignableFrom(type))
            {
                var ns = string.Format(
                    "nx-annotation:{0};{1}",
                    type.FullName,
                    type.Assembly.GetName().Name);

                var obj = (IAttributeSerializableAnnotation)Activator.CreateInstance(type);
                obj.Deserialize(this, ns, element.Attributes().Where(i => i.Name.NamespaceName == ns));
                return obj;
            }
            else if (typeof(ISerializableAnnotation).IsAssignableFrom(type))
            {
                var obj = (ISerializableAnnotation)Activator.CreateInstance(type);
                obj.Deserialize(this, (XElement)element.FirstNode);
                return obj;
            }
            else if (typeof(IXmlSerializable).IsAssignableFrom(type))
            {
                using (var rdr = element.FirstNode.CreateReader())
                    return GetXmlSerializer(type).Deserialize(rdr);
            }
            else if (type.GetCustomAttribute<XmlRootAttribute>() != null)
            {
                using (var rdr = element.FirstNode.CreateReader())
                    return GetXmlSerializer(type).Deserialize(rdr);
            }

            return null;
        }

        static void ApplyAnnotationToDocument(XElement element, XElement annotation, object obj)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var document = element.Document;
            if (document == null)
                throw new InvalidOperationException();

            document.AddAnnotation(obj);
        }

        static void ApplyAnnotationToElement(XElement element, XElement annotation, object obj)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            element.AddAnnotation(obj);
        }

        static void ApplyAnnotationToAttribute(XElement element, XElement annotation, object obj)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var attributeName = (XName)(string)annotation.Attribute(NX_ATTRIBUTE);
            if (attributeName.LocalName == "xmlns")
                return;

            var attribute = element.Attribute(attributeName);
            if (attribute == null)
                throw new InvalidOperationException();

            attribute.AddAnnotation(obj);
        }

        static void ApplyAnnotationToNode(XElement element, XElement annotation, object obj)
        {
            if (element == null)
                throw new ArgumentNullException(nameof(element));
            if (annotation == null)
                throw new ArgumentNullException(nameof(annotation));
            if (obj == null)
                throw new ArgumentNullException(nameof(obj));

            var node = annotation.PreviousNode;
            if (node == null)
                throw new InvalidOperationException();

            node.AddAnnotation(obj);
        }

        #endregion

    }

}
