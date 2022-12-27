# @nxkit/style-dictionary

> Nx Plugin to generate [Style Dictionary](https://amzn.github.io/style-dictionary) projects & maintain your design tokens within your Nx workspace

<img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="90"> X <a href="https://github.com/nxkit/nxkit/tree/main/packages/style-dictionary"><img src="https://amzn.github.io/style-dictionary/assets/logo.png" width="60"></a>

📦 **Plug Style Dictionary into your [Nx](https://nx.dev) workspace**

## Quick Start

Create an Nx workspace and add the Style Dictionary plugin

```bash
npx create-nx-workspace@latest my-org
npm install -D @nxkit/style-dictionary
```

Generate a Style Dictionary library

```bash
npx nx generate @nxkit/style-dictionary:lib my-tokens
```

## Build your tokens

Build your design tokens

```bash
npx nx build my-tokens
```

To know more about the `@nxkit/style-dictionary` plugin, run:

```bash
npx nx list @nxkit/style-dictionary
```

## Generate extensions

If you'd like to add customizatios to your Style Dictionary projects like:

- Custom Actions
- Custom Filters
- Custom Formats
- Custom Parsers
- Custom Transform Groups
- Custom Tranforms

you can generate and register them using the `extension` generator:

```bash
npx nx generate @nxkit/style-dictionary:extension --project my-tokens
```

The terminal will prompt you to choose the desired extensions, or they can be passed in a comma-separated string with the `--extensions` argument. For example:

```bash
npx nx generate @nxkit/style-dictionary:extension --project my-tokens --extensions actions,filters,transforms
```
