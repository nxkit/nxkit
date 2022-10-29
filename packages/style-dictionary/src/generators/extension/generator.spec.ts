import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createLib } from '../../utils/testing/generators';
import generator from './generator';
import { Extension, ExtensionGeneratorSchema } from './schema';

describe('extension generator', () => {
  let appTree: Tree;
  const options: ExtensionGeneratorSchema = {
    project: 'test',
    extensions: [],
    directory: 'src/extensions',
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await createLib(appTree, options.project);
  });

  it('should run successfully', async () => {
    options.extensions = [Extension.ACTIONS, Extension.FILTERS];
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, options.project);
    expect(config).toBeDefined();
    expect(config.targets.build.options.customActions).toBe(
      `libs/${options.project}/src/extensions/actions/index.ts`
    )
    expect(config.targets.build.options.customFilters).toBe(
      `libs/${options.project}/src/extensions/filters/index.ts`
    );
  });
});
