namespace NXKit.Scripting
{

    /// <summary>
    /// Provides a script engine capable of handling one or more language types.
    /// </summary>
    public interface IScriptEngine
    {

        /// <summary>
        /// Returns <c>true</c> if the given script engine can execute the given script.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        bool CanExecute(string type, string code);

        /// <summary>
        /// Evaluates the specified script.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="code"></param>
        object Evaluate(string type, string code);

        /// <summary>
        /// Executes the specified script.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="code"></param>
        void Execute(string type, string code);

        /// <summary>
        /// Initiates a load operation. Engine implementations can load any state they would like to from the 
        /// <see cref="Document"/> instance.
        /// </summary>
        void Load();

        /// <summary>
        /// Initiates a save operation. Engine implementations should save any state they would like to keep to the
        /// <see cref="Document"/> instance in the form of a serializable annotation.
        /// </summary>
        void Save();

    }

}
