using System;
using System.IO;
using System.Net;

namespace NXKit.Net
{

    class ResourceWebRequest :
        WebRequest
    {

        Uri uri;
        string method;
        long contentLength;
        string contentType;
        readonly WebHeaderCollection headers;
        readonly Stream stream;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="uri"></param>
        public ResourceWebRequest(Uri uri)
            : base()
        {
            if (uri == null)
                throw new ArgumentNullException(nameof(uri));
            if (uri.Scheme != ResourceUriHelper.UriSchemeResource)
                throw new ArgumentOutOfRangeException(nameof(uri));

            this.uri = uri;
            this.method = "GET";
            this.contentLength = 0;
            this.headers = new WebHeaderCollection();
            this.stream = new MemoryStream();
        }

        public override Uri RequestUri
        {
            get { return uri; }
        }

        public override string Method
        {
            get { return method; }
            set { method = value; }
        }

        public override long ContentLength
        {
            get { return contentLength; }
            set { contentLength = value; }
        }

        public override string ContentType
        {
            get { return contentType; }
            set { contentType = value; }
        }

        public override WebHeaderCollection Headers
        {
            get { return headers; }
        }

        public override Stream GetRequestStream()
        {
            return stream;
        }

        public override WebResponse GetResponse()
        {
            return GetResponseImpl();
        }

        WebResponse GetResponseImpl()
        {
            switch (method)
            {
                case "GET":
                    return GetGetResponse();
            }

            throw new WebException("Method " + method + " not implemented.");
        }

        WebResponse GetGetResponse()
        {
            return new ResourceWebResponse(this);
        }

    }

}
