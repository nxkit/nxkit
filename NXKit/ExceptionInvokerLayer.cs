using System;
using System.Collections.Generic;
using System.Runtime.ExceptionServices;

using NXKit.Composition;

namespace NXKit
{

    [Export(typeof(IInvokerLayer), CompositionScope.Host)]
    public class ExceptionInvokerLayer :
        IInvokerLayer
    {

        readonly IEnumerable<IExceptionHandler> handlers;

        /// <summary>
        /// Initializes a new instance.
        /// </summary>
        /// <param name="handlers"></param>
        public ExceptionInvokerLayer(IEnumerable<IExceptionHandler> handlers)
        {
            this.handlers = handlers ?? throw new ArgumentNullException(nameof(handlers));
        }

        public void Invoke(Action action)
        {
            try
            {
                action();
            }
            catch (Exception e)
            {
                HandleException(e);
            }
        }

        public R Invoke<R>(Func<R> func)
        {
            try
            {
                return func();
            }
            catch (Exception e)
            {
                HandleException(e);
            }

            return default(R);
        }

        /// <summary>
        /// Handles an exception by dispatching it to the root <see cref="IExceptionHandler"/>.
        /// </summary>
        /// <param name="exception"></param>
        void HandleException(Exception exception)
        {
            if (exception == null)
                throw new ArgumentNullException(nameof(exception));

            bool rethrow = true;

            // search for exception handlers
            foreach (var handler in handlers)
                if (handler.HandleException(exception))
                    rethrow = false;

            // should we rethrow the exception?
            if (rethrow)
                ExceptionDispatchInfo.Capture(exception).Throw();
        }

    }

}
