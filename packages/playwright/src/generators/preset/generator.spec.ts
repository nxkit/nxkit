import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './generator';
import { PresetGeneratorSchema } from './schema';

describe('preset generator', () => {
  let appTree: Tree;
  const options: PresetGeneratorSchema = {
    name: 'myapp-e2e',
    baseUrl: 'http://localhost:4200',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'myapp-e2e');
    expect(config).toBeDefined();
  });
});
