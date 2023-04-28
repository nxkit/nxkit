import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './generator';
import { PresetGeneratorSchema } from './schema';
import { Preset } from '../library/schema';

describe('preset generator', () => {
  let appTree: Tree;
  const options: PresetGeneratorSchema = {
    name: 'my-tokens',
    preset: Preset.BASIC,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'my-tokens');
    expect(config).toBeDefined();
  });
});
