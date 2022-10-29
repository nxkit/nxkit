# NxKit

> Keyboard crafted plugins for you Nx workspace

[![CI](https://github.com/nxkit/nxkit/actions/workflows/ci.yml/badge.svg)](https://github.com/nxkit/nxkit/actions/workflows/ci.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<p style="text-align: center;">
<img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="100">
<br>
<a href="/packages/playwright" style="margin-left: 1em;"><img src="https://playwright.dev/img/playwright-logo.svg" width="70"></a>
<a href="/packages/style-dictionary"><img src="https://amzn.github.io/style-dictionary/assets/logo.png" width="70"></a>
</p>

🔎 **Plug Playwright into your [Nx](https://nx.dev) workspace**

## Quick Start

Create an Nx workspace

```bash
npx create-nx-workspace@latest my-org --preset apps
```

Add the Playwright plugin and generate a Playwright project

```bash
npm install -D @nxkit/playwright
```

```bash
npx nx generate @nxkit/playwright:project my-app-e2e
```

Run your E2E tests!

```bash
npx nx e2e my-app-e2e
```

See your tests report

```bash
npx nx show-report my-app-e2e
```

To know more about the `@nxkit/playwright` plugin, run:

```bash
npx nx list @nxkit/playwright
```
