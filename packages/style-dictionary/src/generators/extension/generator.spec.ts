import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTestTokensLib } from '../../utils/testing/generators';
import { extensionGenerator } from './generator';
import { Extension, ExtensionGeneratorSchema } from './schema';
import * as extensionSchema from './schema.json';

describe('extension generator', () => {
  let appTree: Tree;
  const options: ExtensionGeneratorSchema = {
    project: 'test-tokens',
    extensions: [],
    directory: extensionSchema.properties.directory.default,
  };

  beforeEach(async () => {
    appTree = await createTestTokensLib(options.project, {
      appsLibsLayout: true,
    });
  });

  it('should run successfully', async () => {
    options.extensions = [Extension.ACTIONS, Extension.FILTERS];
    await extensionGenerator(appTree, options);
    const config = readProjectConfiguration(appTree, options.project);
    expect(config).toBeDefined();
    expect(config.targets.build.options.customActions).toBe(
      `libs/${options.project}/src/extensions/actions/index.ts`
    );
    expect(config.targets.build.options.customFilters).toBe(
      `libs/${options.project}/src/extensions/filters/index.ts`
    );
  });
});
