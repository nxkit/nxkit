import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

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
    await projectGenerator(appTree, {
      ...options,
      frontendProject: 'test-app',
    });
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config).toBeDefined();
  });
});
