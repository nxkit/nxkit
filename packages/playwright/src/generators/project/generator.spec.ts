import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  Tree,
  readProjectConfiguration,
  addProjectConfiguration,
} from '@nrwl/devkit';

import { projectGenerator } from './generator';
import { ProjectGeneratorSchema } from './schema';

describe('project generator', () => {
  let appTree: Tree;
  const options: ProjectGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should create standalone e2e project', async () => {
    await projectGenerator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config).toBeDefined();
  });

  it('should create e2e project for a frontend app', async () => {
    const frontendProject = 'test-app';
    const project = frontendProject + '-e2e';
    addProjectConfiguration(appTree, frontendProject, {
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
      name: project,
      frontendProject,
    });
    const config = readProjectConfiguration(appTree, project);
    expect(config).toBeDefined();
  });
});
