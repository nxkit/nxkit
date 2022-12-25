# @nxkit/playwright

> Nx Plugin for Playwright contains executors and generators allowing your workspace to use the powerful Playwright end-to-end testing capabilities.

<img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="90"> X <a href="https://github.com/nxkit/nxkit/tree/main/packages/playwright" style="margin-left: 1em;"><img src="https://playwright.dev/img/playwright-logo.svg" width="60"></a>

🔎 **Plug Playwright into your [Nx](https://nx.dev) workspace**

## Quick Start

Create an Nx workspace

```bash
npx create-nx-workspace@latest my-org
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
