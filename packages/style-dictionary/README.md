# @nxkit/style-dictionary

> Generate Style Dictionary projects & maintain your design tokens within your Nx workspace

🔎 **Plug Playwright into your [Nx](https://nx.dev) workspace**

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

## 

Build your desig tokens

```bash
npx nx build my-tokens
```

See your tests report

```bash
npx nx show-report my-app-e2e
```

To know more about the `@nxkit/playwright` plugin, run:

```bash
npx nx list @nxkit/playwright
```
