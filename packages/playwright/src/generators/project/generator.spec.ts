import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { ProjectGeneratorSchema } from './schema';

describe('project generator', () => {
  let appTree: Tree;
  const options: ProjectGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should create standalone project', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config).toBeDefined();
  });

  it('should create standalone project', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config).toBeDefined();
  });
});
