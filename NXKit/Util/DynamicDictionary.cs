using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;

namespace NXKit.Util
{

    /// <summary>
    /// A dictionary that supports dynamic access.
    /// </summary>
    public class DynamicDictionary :
        DynamicObject,
        IEquatable<DynamicDictionary>,
        IEnumerable<string>,
        IDictionary<string, object>
    {

        readonly IDictionary<string, dynamic> dictionary =
            new Dictionary<string, dynamic>(StringComparer.InvariantCulture);

        /// <summary>
        /// Returns an empty dynamic dictionary.
        /// </summary>
        /// <value>A <see cref="DynamicDictionary"/> instance.</value>
        public static DynamicDictionary Empty => new DynamicDictionary();

        /// <summary>
        /// Creates a dynamic dictionary from an <see cref="IDictionary{TKey,TValue}"/> instance.
        /// </summary>
        /// <param name="values">An <see cref="IDictionary{TKey,TValue}"/> instance, that the dynamic dictionary should be created from.</param>
        /// <returns>An <see cref="DynamicDictionary"/> instance.</returns>
        public static DynamicDictionary Create(IDictionary<string, object> values)
        {
            if (values == null)
                throw new ArgumentNullException(nameof(values));

            var instance = new DynamicDictionary();
            foreach (var key in values.Keys)
                instance[key] = values[key];

            return instance;
        }

        /// <summary>
        /// Provides the implementation for operations that set member values. Classes derived from the <see cref="T:System.Dynamic.DynamicObject"/> class can override this method to specify dynamic behavior for operations such as setting a value for a property.
        /// </summary>
        /// <returns>true if the operation is successful; otherwise, false. If this method returns false, the run-time binder of the language determines the behavior. (In most cases, a language-specific run-time exception is thrown.)</returns>
        /// <param name="binder">Provides information about the object that called the dynamic operation. The binder.Name property provides the name of the member to which the value is being assigned. For example, for the statement sampleObject.SampleProperty = "Test", where sampleObject is an instance of the class derived from the <see cref="T:System.Dynamic.DynamicObject"/> class, binder.Name returns "SampleProperty". The binder.IgnoreCase property specifies whether the member name is case-sensitive.</param><param name="value">The value to set to the member. For example, for sampleObject.SampleProperty = "Test", where sampleObject is an instance of the class derived from the <see cref="T:System.Dynamic.DynamicObject"/> class, the <paramref name="value"/> is "Test".</param>
        public override bool TrySetMember(SetMemberBinder binder, object value)
        {
            this[binder.Name] = value;
            return true;
        }

        /// <summary>
        /// Provides the implementation for operations that get member values. Classes derived from the <see cref="T:System.Dynamic.DynamicObject"/> class can override this method to specify dynamic behavior for operations such as getting a value for a property.
        /// </summary>
        /// <returns>true if the operation is successful; otherwise, false. If this method returns false, the run-time binder of the language determines the behavior. (In most cases, a run-time exception is thrown.)</returns>
        /// <param name="binder">Provides information about the object that called the dynamic operation. The binder.Name property provides the name of the member on which the dynamic operation is performed. For example, for the Console.WriteLine(sampleObject.SampleProperty) statement, where sampleObject is an instance of the class derived from the <see cref="T:System.Dynamic.DynamicObject"/> class, binder.Name returns "SampleProperty". The binder.IgnoreCase property specifies whether the member name is case-sensitive.</param><param name="result">The result of the get operation. For example, if the method is called for a property, you can assign the property value to <paramref name="result"/>.</param>
        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            if (!dictionary.TryGetValue(binder.Name, out result))
                result = new DynamicDictionaryValue(null);

            return true;
        }

        /// <summary>
        /// Returns the enumeration of all dynamic member names.
        /// </summary>
        /// <returns>A <see cref="IEnumerable{T}"/> that contains dynamic member names.</returns>
        public override IEnumerable<string> GetDynamicMemberNames()
        {
            return dictionary.Keys;
        }

        /// <summary>
        /// Returns the enumeration of all dynamic member names.
        /// </summary>
        /// <returns>A <see cref="IEnumerable{T}"/> that contains dynamic member names.</returns>
        public IEnumerator<string> GetEnumerator()
        {
            return dictionary.Keys.GetEnumerator();
        }

        /// <summary>
        /// Returns the enumeration of all dynamic member names.
        /// </summary>
        /// <returns>A <see cref="IEnumerator"/> that contains dynamic member names.</returns>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return dictionary.Keys.GetEnumerator();
        }

        /// <summary>
        /// Gets or sets the <see cref="DynamicDictionaryValue"/> with the specified name.
        /// </summary>
        /// <value>A <see cref="DynamicDictionaryValue"/> instance containing a value.</value>
        public dynamic this[string name]
        {
            get
            {
                if (name == null)
                    throw new ArgumentNullException(nameof(name));

                name = GetNeutralKey(name);

                if (!dictionary.TryGetValue(name, out var member))
                    member = new DynamicDictionaryValue(null);

                return member;
            }
            set
            {
                name = GetNeutralKey(name);

                dictionary[name] = value is DynamicDictionaryValue ? value : new DynamicDictionaryValue(value);
            }
        }

        /// <summary>
        /// Indicates whether the current <see cref="DynamicDictionary"/> is equal to another object of the same type.
        /// </summary>
        /// <returns><see langword="true"/> if the current instance is equal to the <paramref name="other"/> parameter; otherwise, <see langword="false"/>.</returns>
        /// <param name="other">An <see cref="DynamicDictionary"/> instance to compare with this instance.</param>
        public bool Equals(DynamicDictionary other)
        {
            if (ReferenceEquals(null, other))
                return false;

            return ReferenceEquals(this, other) || Equals(other.dictionary, dictionary);
        }

        /// <summary>
        /// Determines whether the specified <see cref="System.Object"/> is equal to this instance.
        /// </summary>
        /// <param name="obj">The <see cref="System.Object"/> to compare with this instance.</param>
        /// <returns><see langword="true"/> if the specified <see cref="System.Object"/> is equal to this instance; otherwise, <see langword="false"/>.</returns>
        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj))
                return false;

            if (ReferenceEquals(this, obj))
                return true;

            return obj.GetType() == typeof(DynamicDictionary) && Equals((DynamicDictionary)obj);
        }

        /// <summary>
        /// Returns an enumerator that iterates through the collection.
        /// </summary>
        /// <returns>A <see cref="T:System.Collections.Generic.IEnumerator`1"/> that can be used to iterate through the collection.</returns>
        IEnumerator<KeyValuePair<string, dynamic>> IEnumerable<KeyValuePair<string, object>>.GetEnumerator()
        {
            return dictionary.GetEnumerator();
        }

        /// <summary>
        /// Returns a hash code for this <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <returns> A hash code for this <see cref="DynamicDictionary"/>, suitable for use in hashing algorithms and data structures like a hash table.</returns>
        public override int GetHashCode()
        {
            return (dictionary != null ? dictionary.GetHashCode() : 0);
        }

        /// <summary>
        /// Adds an element with the provided key and value to the <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <param name="key">The object to use as the key of the element to add.</param>
        /// <param name="value">The object to use as the value of the element to add.</param>
        public void Add(string key, dynamic value)
        {
            this[key] = value;
        }

        /// <summary>
        /// Adds an item to the <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <param name="item">The object to add to the <see cref="DynamicDictionary"/>.</param>
        public void Add(KeyValuePair<string, dynamic> item)
        {
            this[item.Key] = item.Value;
        }

        /// <summary>
        /// Determines whether the <see cref="DynamicDictionary"/> contains an element with the specified key.
        /// </summary>
        /// <returns><see langword="true" /> if the <see cref="DynamicDictionary"/> contains an element with the key; otherwise, <see langword="false" />.
        /// </returns>
        /// <param name="key">The key to locate in the <see cref="DynamicDictionary"/>.</param>
        public bool ContainsKey(string key)
        {
            return dictionary.ContainsKey(key);
        }

        /// <summary>
        /// Gets an <see cref="T:System.Collections.Generic.ICollection`1"/> containing the keys of the <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <returns>An <see cref="T:System.Collections.Generic.ICollection`1"/> containing the keys of the <see cref="DynamicDictionary"/>.</returns>
        public ICollection<string> Keys
        {
            get { return dictionary.Keys; }
        }

        /// <summary>
        /// Gets the value associated with the specified key.
        /// </summary>
        /// <returns><see langword="true" /> if the <see cref="DynamicDictionary"/> contains an element with the specified key; otherwise, <see langword="false" />.</returns>
        /// <param name="key">The key whose value to get.</param>
        /// <param name="value">When this method returns, the value associated with the specified key, if the key is found; otherwise, the default value for the type of the <paramref name="value"/> parameter. This parameter is passed uninitialized.</param>
        public bool TryGetValue(string key, out dynamic value)
        {
            return dictionary.TryGetValue(key, out value);
        }

        /// <summary>
        /// Removes all items from the <see cref="DynamicDictionary"/>.
        /// </summary>
        public void Clear()
        {
            dictionary.Clear();
        }

        /// <summary>
        /// Gets the number of elements contained in the <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <returns>The number of elements contained in the <see cref="DynamicDictionary"/>.</returns>
        public int Count
        {
            get { return dictionary.Count; }
        }

        /// <summary>
        /// Determines whether the <see cref="DynamicDictionary"/> contains a specific value.
        /// </summary>
        /// <returns><see langword="true" /> if <paramref name="item"/> is found in the <see cref="DynamicDictionary"/>; otherwise, <see langword="false" />.
        /// </returns>
        /// <param name="item">The object to locate in the <see cref="DynamicDictionary"/>.</param>
        public bool Contains(KeyValuePair<string, dynamic> item)
        {
            return dictionary.Contains(GetDynamicKeyValuePair(item));
        }

        /// <summary>
        /// Copies the elements of the <see cref="DynamicDictionary"/> to an <see cref="T:System.Array"/>, starting at a particular <see cref="T:System.Array"/> index.
        /// </summary>
        /// <param name="array">The one-dimensional <see cref="T:System.Array"/> that is the destination of the elements copied from the <see cref="DynamicDictionary"/>. The <see cref="T:System.Array"/> must have zero-based indexing.</param>
        /// <param name="arrayIndex">The zero-based index in <paramref name="array"/> at which copying begins.</param>
        public void CopyTo(KeyValuePair<string, dynamic>[] array, int arrayIndex)
        {
            dictionary.CopyTo(array, arrayIndex);
        }

        /// <summary>
        /// Gets a value indicating whether the <see cref="DynamicDictionary"/> is read-only.
        /// </summary>
        /// <returns>Always returns <see langword="false" />.</returns>
        public bool IsReadOnly
        {
            get { return false; }
        }

        /// <summary>
        /// Removes the element with the specified key from the <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <returns><see langword="true" /> if the element is successfully removed; otherwise, <see langword="false" />.</returns>
        /// <param name="key">The key of the element to remove.</param>
        public bool Remove(string key)
        {
            return dictionary.Remove(GetNeutralKey(key));
        }

        /// <summary>
        /// Removes the first occurrence of a specific object from the <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <returns><see langword="true" /> if <paramref name="item"/> was successfully removed from the <see cref="DynamicDictionary"/>; otherwise, <see langword="false" />.</returns>
        /// <param name="item">The object to remove from the <see cref="DynamicDictionary"/>.</param>
        public bool Remove(KeyValuePair<string, dynamic> item)
        {
            return dictionary.Remove(GetDynamicKeyValuePair(item));
        }

        /// <summary>
        /// Gets an <see cref="T:System.Collections.Generic.ICollection`1"/> containing the values in the <see cref="DynamicDictionary"/>.
        /// </summary>
        /// <returns>An <see cref="T:System.Collections.Generic.ICollection`1"/> containing the values in the <see cref="DynamicDictionary"/>.</returns>
        public ICollection<dynamic> Values
        {
            get { return dictionary.Values; }
        }

        static KeyValuePair<string, dynamic> GetDynamicKeyValuePair(KeyValuePair<string, dynamic> item)
        {
            return new KeyValuePair<string, dynamic>(item.Key, new DynamicDictionaryValue(item.Value));
        }

        static string GetNeutralKey(string key)
        {
            if (key == null)
                throw new ArgumentNullException(nameof(key));

            return key.Replace("-", string.Empty);
        }

    }

}