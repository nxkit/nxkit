import {
  addProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { projectGenerator } from './generator';
import { ProjectGeneratorSchema } from './schema';

describe('Playwright Project', () => {
  let appTree: Tree;
  const options: ProjectGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('standalone', () => {
    it('should add the project configuration', async () => {
      const projectName = options.name + '-e2e';
      await projectGenerator(appTree, options);

      const project = readProjectConfiguration(appTree, options.name);
      expect(project).toBeDefined();

      expect(project.targets.e2e).toEqual({
        executor: '@nxkit/playwright:test',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/apps/${projectName}/test-results`,
          playwrightConfig: `apps/${projectName}/playwright.config.ts`,
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
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/apps/${projectName}/test-results`,
          playwrightConfig: `apps/${projectName}/playwright.config.ts`,
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
          reportPath: `dist/apps/${projectName}/playwright-report`,
        },
      });

      expect(project.targets.lint).toEqual({
        executor: '@nrwl/linter:eslint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: [`apps/${projectName}/**/*.{js,ts}`],
        },
      });
    });

    it('should generate project files', async () => {
      const projectName = options.name + '-e2e';
      await projectGenerator(appTree, options);

      expect(
        appTree.exists(`apps/${projectName}/playwright.config.ts`)
      ).toBeTruthy();
      expect(
        appTree.exists(`apps/${projectName}/src/e2e/app.spec.ts`)
      ).toBeTruthy();
      expect(
        appTree.exists(
          `apps/${projectName}/src/tests-examples/demo-todo-app.spec.ts`
        )
      ).toBeTruthy();
    });
  });

  describe('nested', () => {});

  it('should create e2e project for a frontend app', async () => {
    const frontendProjectName = 'test-app';
    const projectName = frontendProjectName + '-e2e';
    addProjectConfiguration(appTree, frontendProjectName, {
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

    await projectGenerator(appTree, {
      ...options,
      name: projectName,
      frontendProject: frontendProjectName,
    });

    const project = readProjectConfiguration(appTree, projectName);
    expect(project).toBeDefined();
    expect(project.implicitDependencies).toEqual([frontendProjectName]);
  });
});
