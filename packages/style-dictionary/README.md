<p align="center">
    <a href="https://nx.dev">
        <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="90">
    </a>
    <a href="https://github.com/nxkit/nxkit/tree/main/packages/style-dictionary" style="margin-left: 1rem;">
        <img src="https://amzn.github.io/style-dictionary/assets/logo.png" width="60">
    </a>
    <br><br>
    <a href="https://github.com/nxkit">
        <img alt="NxKit" src="https://github.com/nxkit.png" width="100" />
    </a>
</p>
<h1 align="center">
  @nxkit/style-dictionary
</h1>

<h2 align="center">
    🔌 Plug <a href="https://amzn.github.io/style-dictionary">Style Dictionary</a> into your <a href="https://nx.dev">Nx</a> workspace
</h2>

<br>

> Nx Plugin to generate Style Dictionary projects & maintain your design tokens within your Nx workspace

## Quick Start

Create an Nx workspace and add the Style Dictionary plugin

```bash
npx create-nx-workspace@latest my-org
```

```bash
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

That's it!

To know more about the `@nxkit/style-dictionary` plugin, run:

```bash
npx nx list @nxkit/style-dictionary
```
