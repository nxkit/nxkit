using Autofac;
using Autofac.Extensions.DependencyInjection;

using Microsoft.AspNetCore.Blazor.Hosting;

using NXKit.Autofac;

namespace NXKit.AspNetCore.Blazor.Examples.Client
{

    public static class Program
    {

        public static void Main(string[] args)
        {
            BlazorWebAssemblyHost.CreateDefaultBuilder()
                .UseServiceProviderFactory(new AutofacServiceProviderFactory(BuildContainer))
                .UseBlazorStartup<Startup>()
                .Build()
                .Run();
        }

        static void BuildContainer(ContainerBuilder builder)
        {
            builder.RegisterAssemblyModules(new[]
            {
                typeof(Program).Assembly,
                typeof(Cogito.Extensions.Logging.Autofac.AssemblyModule).Assembly,
            });

            builder.RegisterNXKit(new[]
            {
                typeof(NXKit.DocumentEnvironment).Assembly,
                typeof(NXKit.AspNetCore.Components._Imports).Assembly,
                typeof(NXKit.DOM.DOMException).Assembly,
                typeof(NXKit.DOMEvents.ActionEventListener).Assembly,
                typeof(NXKit.NXInclude.Include).Assembly,
                typeof(NXKit.Scripting.Console).Assembly,
                typeof(NXKit.XInclude.Include).Assembly,
                typeof(NXKit.XMLEvents.Events).Assembly,
                typeof(NXKit.XPath.DefaultXsltContextFunctionProvider).Assembly,
                typeof(NXKit.XPath2.Functions.Flags).Assembly,
                typeof(NXKit.XForms.VarProperties).Assembly,
                typeof(NXKit.AspNetCore.Components.XForms.XFormsComponentTypeProvider).Assembly,
                typeof(NXKit.XForms.Layout.Paragraph).Assembly,
                typeof(NXKit.AspNetCore.Components.XForms.Layout.XFormsLayoutComponentTypeProvider).Assembly,
                typeof(NXKit.XForms.Examples.ExampleIOTransport).Assembly,
                typeof(NXKit.XHtml.Div).Assembly,
                typeof(NXKit.AspNetCore.Components.XHtml._Imports).Assembly,
            });
        }

    }

}
