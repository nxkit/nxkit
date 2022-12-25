# @nxkit/style-dictionary

> Nx Plugin to generate [Style Dictionary](https://amzn.github.io/style-dictionary) projects & maintain your design tokens within your Nx workspace

<img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="90"> X <a href="https://github.com/nxkit/nxkit/tree/main/packages/style-dictionary"><img src="https://amzn.github.io/style-dictionary/assets/logo.png" width="60"></a>

📦 **Plug Style Dictionary into your [Nx](https://nx.dev) workspace**

## Quick Start

Create an Nx workspace

```bash
npx create-nx-workspace@latest my-org
```

Add the Style Dictionary plugin

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
