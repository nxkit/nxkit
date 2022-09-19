import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { runNxCommandAsync } from '@nxkit/utils/testing';

describe('playwright e2e', () => {
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

  it('should create playwright', async () => {
    const project = uniq('playwright') + '-e2e';

    await runNxCommandAsync(`generate @nxkit/playwright:project ${project}`);
    const result = await runNxCommandAsync(`e2e ${project}`, {
      env: {
        // Workaround this issue https://github.com/microsoft/playwright/issues/17438
        JEST_WORKER_ID: undefined,
      },
    });
    expect(result.stdout).toContain('Playwright tests ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('playwright') + '-e2e';
      await runNxCommandAsync(
        `generate @nxkit/playwright:project ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${project}/src/e2e/example.spec.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('playwright') + '-e2e';
      ensureNxProject('@nxkit/playwright', 'dist/packages/playwright');
      await runNxCommandAsync(
        `generate @nxkit/playwright:project ${projectName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${projectName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
