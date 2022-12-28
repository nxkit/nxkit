<p align="center">
    <a href="https://nx.dev">
        <img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="90">
    </a>
    <a href="https://github.com/nxkit/nxkit/tree/main/packages/style-dictionary" style="margin-left: 1rem;">
        <img src="https://playwright.dev/img/playwright-logo.svg" width="65">
    </a>
    <br><br>
    <a href="https://github.com/nxkit">
        <img alt="NxKit" src="https://github.com/nxkit.png" width="100" />
    </a>
</p>
<h1 align="center">
  @nxkit/playwright
</h1>

<h2 align="center">
    🔌 Plug <a href="https://playwright.dev">Playwright</a> into your <a href="https://nx.dev">Nx</a> workspace
</h2>

<br>

> Nx Plugin containing executors and generators allowing your workspace to use the powerful Playwright end-to-end testing capabilities.

## Quick Start

Create an Nx workspace and add the Playwirght plugin

```bash
npx create-nx-workspace@latest my-org
```

```bash
npm install -D @nxkit/playwright
```

### Create a playwright E2E project

Create a web project in your workspace without a default e2e test runner. This is a `@nrwl/react` example:

```bash
npx nx generate @nrwl/react:app my-app --e2eTestRunner none
```

or, you can delete an existing e2e project, using:

```bash
npx nx generate @nrwl/workspace:rm --project my-app-e2e
```

Now, for this `my-app` project, you can create a Playwright e2e testing project using:

```bash
npx nx generate @nxkit/playwright:project my-app-e2e --frontendProject my-app
```

This will behave similar to what the official `@nrwl/cypress` plugin does. It will `serve` the `my-app` application, run e2e tests and provide the result.

**Standalone E2E project**

You can also create a Playwright E2E testing project without depending on an existing web project.

```bash
npx nx generate @nxkit/playwright:project my-app-e2e
```

This project won't run against a workspace project but against a given `baseUrl` instead. Check the `my-app-e2e/project.json` file to set your respective baseUrl.

### Run your E2E tests!

Run the `e2e` target for your e2e testing project

```bash
npx nx e2e my-app-e2e
```

See your tests report

```bash
npx nx show-report my-app-e2e
```

That's it!

To know more about the `@nxkit/playwright` plugin, run:

```bash
npx nx list @nxkit/playwright
```
