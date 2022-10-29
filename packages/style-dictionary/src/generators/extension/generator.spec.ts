import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createLib } from '../../utils/testing/generators';
import generator from './generator';
import { ExtensionGeneratorSchema } from './schema';

describe('extension generator', () => {
  let appTree: Tree;
  const options: ExtensionGeneratorSchema = { project: 'test' };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await createLib(appTree, options.project);
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
