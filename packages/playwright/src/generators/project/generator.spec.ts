import {
  addProjectConfiguration,
  joinPathFragments,
  readJson,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorSchema } from './schema';

describe('Playwright Project', () => {
  let appTree: Tree;
  const defaultOptions: Omit<ProjectGeneratorSchema, 'name'> = {
    skipFormat: false,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add the project configuration', async () => {
    await projectGenerator(appTree, {
      ...defaultOptions,
      name: 'my-app-e2e',
    });

    const project = readProjectConfiguration(appTree, 'my-app-e2e');
    expect(project).toBeDefined();

    expect(project.targets.e2e).toEqual({
      executor: '@nxkit/playwright:test',
      outputs: ['{workspaceRoot}/dist/{projectRoot}'],
      options: {
        outputPath: `dist/apps/my-app-e2e/test-results`,
        playwrightConfig: `apps/my-app-e2e/playwright.config.ts`,
        baseUrl: 'https://example.com',
      },
      configurations: {
        production: {
          baseUrl: 'https://example.com',
        },
      },
    });

    expect(project.targets.debug).toEqual({
      executor: '@nxkit/playwright:test',
      outputs: ['{workspaceRoot}/dist/{projectRoot}'],
      options: {
        outputPath: `dist/apps/my-app-e2e/test-results`,
        playwrightConfig: `apps/my-app-e2e/playwright.config.ts`,
        baseUrl: 'https://example.com',
        debug: true,
      },
      configurations: {
        production: {
          baseUrl: 'https://example.com',
        },
      },
    });

    expect(project.targets['show-report']).toEqual({
      executor: '@nxkit/playwright:show-report',
      options: {
        reportPath: `dist/apps/my-app-e2e/playwright-report`,
      },
    });

    expect(project.targets.lint).toEqual({
      executor: '@nx/linter:eslint',
      outputs: ['{options.outputFile}'],
      options: {
        lintFilePatterns: [`apps/my-app-e2e/**/*.{js,ts}`],
      },
    });
  });

  it('should generate project files', async () => {
    await projectGenerator(appTree, {
      ...defaultOptions,
      name: 'my-app-e2e',
    });

    [
      'apps/my-app-e2e/playwright.config.ts',
      'apps/my-app-e2e/src/e2e/app.spec.ts',
      'apps/my-app-e2e/src/tests-examples/demo-todo-app.spec.ts',
    ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
  });

  it('should add tags', async () => {
    await projectGenerator(appTree, {
      ...defaultOptions,
      name: 'my-app-e2e',
      tags: 'type:e2e,scope:my-app',
    });

    const project = readProjectConfiguration(appTree, 'my-app-e2e');
    expect(project.tags).toEqual(['type:e2e', 'scope:my-app']);
  });

  it('should set right path names in `playwright.config.ts`', async () => {
    await projectGenerator(appTree, {
      ...defaultOptions,
      name: 'my-app-e2e',
    });
    const playwrightConfig = appTree.read(
      'apps/my-app-e2e/playwright.config.ts',
      'utf-8'
    );
    expect(playwrightConfig).toMatchSnapshot();
  });

  it('should set right path names in `tsconfig.e2e.json`', async () => {
    await projectGenerator(appTree, {
      ...defaultOptions,
      name: 'my-app-e2e',
    });
    const tsconfigE2EJson = readJson(
      appTree,
      'apps/my-app-e2e/tsconfig.e2e.json'
    );
    expect(tsconfigE2EJson).toMatchSnapshot();
  });

  it('should extend from tsconfig.base.json', async () => {
    await projectGenerator(appTree, {
      ...defaultOptions,
      name: 'my-app-e2e',
    });

    const tsConfig = readJson(appTree, 'apps/my-app-e2e/tsconfig.json');
    expect(tsConfig.extends).toBe('../../tsconfig.base.json');
  });

  describe('--directory', () => {
    beforeEach(() => {
      addProjectConfiguration(appTree, 'my-dir-my-app', {
        root: 'my-dir/my-app',
        targets: {
          serve: {
            executor: 'serve-executor',
            options: {},
            configurations: {
              production: {},
            },
          },
        },
      });
    });

    it('should generate in the right directory', async () => {
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        directory: 'my-dir',
      });

      const project = readProjectConfiguration(appTree, 'my-dir-my-app-e2e');
      expect(project).toBeDefined();
      expect(project.root).toEqual('apps/my-dir/my-app-e2e');
      expect(project.sourceRoot).toEqual('apps/my-dir/my-app-e2e/src');
      expect(project.targets.e2e.options.outputPath).toEqual(
        'dist/apps/my-dir/my-app-e2e/test-results'
      );

      [
        'apps/my-dir/my-app-e2e/playwright.config.ts',
        'apps/my-dir/my-app-e2e/src/e2e/app.spec.ts',
        'apps/my-dir/my-app-e2e/src/tests-examples/demo-todo-app.spec.ts',
      ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });

    it('should generate in nested --directory', async () => {
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        directory: 'foo/bar',
      });

      const project = readProjectConfiguration(appTree, 'foo-bar-my-app-e2e');
      expect(project).toBeDefined();
      expect(project.root).toEqual('apps/foo/bar/my-app-e2e');
      expect(project.sourceRoot).toEqual('apps/foo/bar/my-app-e2e/src');
      expect(project.targets.e2e.options.outputPath).toEqual(
        'dist/apps/foo/bar/my-app-e2e/test-results'
      );

      [
        'apps/foo/bar/my-app-e2e/playwright.config.ts',
        'apps/foo/bar/my-app-e2e/src/e2e/app.spec.ts',
        'apps/foo/bar/my-app-e2e/src/tests-examples/demo-todo-app.spec.ts',
      ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });

    it('should set right path names in `playwright.config.ts`', async () => {
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        directory: 'my-dir',
      });
      const playwrightConfig = appTree.read(
        'apps/my-dir/my-app-e2e/playwright.config.ts',
        'utf-8'
      );
      expect(playwrightConfig).toMatchSnapshot();
    });

    it('should set right path names in `tsconfig.e2e.json`', async () => {
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        directory: 'my-dir',
      });
      const tsconfigE2EJson = readJson(
        appTree,
        'apps/my-dir/my-app-e2e/tsconfig.e2e.json'
      );
      expect(tsconfigE2EJson).toMatchSnapshot();
    });

    it('should extend from tsconfig.base.json', async () => {
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        directory: 'my-dir',
      });

      const tsConfig = readJson(
        appTree,
        'apps/my-dir/my-app-e2e/tsconfig.json'
      );
      expect(tsConfig.extends).toBe('../../../tsconfig.base.json');
    });
  });

  describe('--frontendProject', () => {
    beforeEach(() => {
      addProjectConfiguration(appTree, 'my-app', {
        root: 'my-app',
        targets: {
          serve: {
            executor: 'serve-executor',
            options: {},
            configurations: {
              production: {},
            },
          },
        },
      });
    });

    describe('none', () => {
      it('should not add any implicit dependencies', async () => {
        await projectGenerator(appTree, {
          ...defaultOptions,
          name: 'my-app-e2e',
        });
        const project = readProjectConfiguration(appTree, 'my-app-e2e');
        expect(project.implicitDependencies).not.toBeDefined();
        expect(project.tags).toEqual([]);
      });
    });

    it('should add the project configuration', async () => {
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        frontendProject: 'my-app',
      });

      const project = readProjectConfiguration(appTree, 'my-app-e2e');
      expect(project).toBeDefined();

      expect(project.targets.e2e).toEqual({
        executor: '@nxkit/playwright:test',
        outputs: ['{workspaceRoot}/dist/{projectRoot}'],
        options: {
          outputPath: `dist/apps/my-app-e2e/test-results`,
          playwrightConfig: `apps/my-app-e2e/playwright.config.ts`,
          devServerTarget: 'my-app:serve',
        },
        configurations: {
          production: {
            devServerTarget: 'my-app:serve:production',
          },
        },
      });

      expect(project.targets.debug).toEqual({
        executor: '@nxkit/playwright:test',
        outputs: ['{workspaceRoot}/dist/{projectRoot}'],
        options: {
          outputPath: `dist/apps/my-app-e2e/test-results`,
          playwrightConfig: `apps/my-app-e2e/playwright.config.ts`,
          devServerTarget: 'my-app:serve',
          debug: true,
        },
        configurations: {
          production: {
            devServerTarget: 'my-app:serve:production',
          },
        },
      });
    });

    it('should add implicit dependencies', async () => {
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        frontendProject: 'my-app',
      });

      const project = readProjectConfiguration(appTree, 'my-app-e2e');
      expect(project).toBeDefined();
      expect(project.implicitDependencies).toEqual(['my-app']);
    });

    it('should not throw an error when --project does not have targets', async () => {
      const projectConf = readProjectConfiguration(appTree, 'my-app');
      delete projectConf.targets;

      updateProjectConfiguration(appTree, 'my-app', projectConf);
      await projectGenerator(appTree, {
        ...defaultOptions,
        name: 'my-app-e2e',
        frontendProject: 'my-app',
      });

      const projectConfig = readProjectConfiguration(appTree, 'my-app-e2e');
      expect(projectConfig.targets['e2e'].options.devServerTarget).toEqual(
        'my-app:serve'
      );
    });

    describe('should be able to resolve directory path based on the workspace layout', () => {
      test.each`
        directory               | expectedProjectName      | projectRoot
        ${'/frontend'}          | ${'frontend-my-app-e2e'} | ${'apps/frontend/my-app-e2e'}
        ${'apps'}               | ${'my-app-e2e'}          | ${'apps/my-app-e2e'}
        ${'/apps/frontend'}     | ${'frontend-my-app-e2e'} | ${'apps/frontend/my-app-e2e'}
        ${'apps/frontend'}      | ${'frontend-my-app-e2e'} | ${'apps/frontend/my-app-e2e'}
        ${'/packages'}          | ${'my-app-e2e'}          | ${'packages/my-app-e2e'}
        ${'/packages/frontend'} | ${'frontend-my-app-e2e'} | ${'packages/frontend/my-app-e2e'}
      `(
        'when directory is "$directory" should generate "$expectedProjectName" with project\'s root at "$projectRoot"',
        async ({ directory, expectedProjectName, projectRoot }) => {
          await projectGenerator(appTree, {
            ...defaultOptions,
            name: 'my-app-e2e',
            directory,
          });
          const config = readProjectConfiguration(appTree, expectedProjectName);

          expect(config.root).toBe(projectRoot);
          expect(config).toMatchSnapshot(
            JSON.stringify(directory, expectedProjectName)
          );
          expect(
            appTree.exists(
              joinPathFragments(projectRoot, 'playwright.config.ts')
            )
          ).toBeTruthy();
        }
      );
    });
  });
});
