namespace NXKit
{

    public class SubmitSerializeContextInfo
    {

        string submissionBody;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        public SubmitSerializeContextInfo()
        {
            submissionBody = "";
        }

        /// <summary>
        /// If the string value of this node is non-empty, then the string value is used in the submission in lieu of
        /// the default instance data serialization.
        /// </summary>
        public string SubmissionBody
        {
            get => submissionBody;
            set => submissionBody = value;
        }

    }

}
