import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { DEFAULT_TIMEOUT, installPackage } from '@nxkit/e2e/utils';

describe('@nxkit/playwright e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@nxkit/playwright', 'dist/packages/playwright');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it(
    'should create a standalone e2e project',
    async () => {
      const project = uniq('app') + '-e2e';

      await runNxCommandAsync(`generate @nxkit/playwright:project ${project}`);

      expect(() => checkFilesExist(`tsconfig.base.json`)).not.toThrow();

      const result = await runNxCommandAsync(`e2e ${project}`, {
        env: {
          // Workaround this issue https://github.com/microsoft/playwright/issues/17438
          JEST_WORKER_ID: undefined,
        },
      });

      expect(result.stdout).toContain('Playwright tests ran');
    },
    DEFAULT_TIMEOUT
  );

  it(
    'should create an e2e project for a frontend app',
    async () => {
      const frontendProject = uniq('app');
      const project = frontendProject + '-e2e';

      installPackage('@nrwl/react', 'latest');
      await runNxCommandAsync(
        `generate @nrwl/react:app ${frontendProject} --e2eTestRunner=none --linter=eslint --bundler vite`
      );
      await runNxCommandAsync(
        `generate @nxkit/playwright:project ${project} --frontendProject=${frontendProject}`
      );
      const result = await runNxCommandAsync(`e2e ${project}`, {
        env: {
          // Workaround this issue https://github.com/microsoft/playwright/issues/17438
          JEST_WORKER_ID: undefined,
        },
      });

      expect(result.stdout).toContain('Playwright tests ran');
    },
    DEFAULT_TIMEOUT
  );

  describe('--directory', () => {
    it(
      'should create src in the specified directory',
      async () => {
        const project = uniq('app') + '-e2e';
        await runNxCommandAsync(
          `generate @nxkit/playwright:project ${project} --directory subdir`
        );
        expect(() =>
          checkFilesExist(`apps/subdir/${project}/src/e2e/app.spec.ts`)
        ).not.toThrow();
      },
      DEFAULT_TIMEOUT
    );
  });

  describe('--tags', () => {
    it(
      'should add tags to the project',
      async () => {
        const projectName = uniq('app') + '-e2e';
        await runNxCommandAsync(
          `generate @nxkit/playwright:project ${projectName} --tags e2etag,e2ePackage`
        );
        const project = readJson(`apps/${projectName}/project.json`);
        expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
      },
      DEFAULT_TIMEOUT
    );
  });
});
