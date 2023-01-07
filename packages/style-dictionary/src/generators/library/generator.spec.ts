import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, readJson } from '@nrwl/devkit';

import { libraryGenerator } from './generator';
import { LibraryGeneratorSchema, Preset } from './schema.d';

describe('Style Dictionary Library', () => {
  let appTree: Tree;
  const defaultOptions: Omit<LibraryGeneratorSchema, 'name'> = {
    preset: Preset.BASIC,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add proejct configuration', async () => {
    await libraryGenerator(appTree, {
      ...defaultOptions,
      name: 'my-tokens',
    });

    const projectConfig = readProjectConfiguration(appTree, 'my-tokens');
    expect(projectConfig).toBeDefined();
  });

  it('should generate project files', async () => {
    await libraryGenerator(appTree, {
      ...defaultOptions,
      name: 'my-tokens',
      preset: Preset.BASIC,
    });

    [
      'libs/my-tokens/style-dictionary.config.ts',
      'libs/my-tokens/src/tokens/color/base.json',
      'libs/my-tokens/src/tokens/color/font.json',
      'libs/my-tokens/src/tokens/size/font.json',
    ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
  });

  it('should extend from tsconfig.base.json', async () => {
    await libraryGenerator(appTree, {
      ...defaultOptions,
      name: 'my-tokens',
    });

    const tsConfig = readJson(appTree, 'libs/my-tokens/tsconfig.json');
    expect(tsConfig.extends).toBe('../../tsconfig.base.json');
  });

  describe('--preset complete', () => {
    it('should generate project files', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        preset: Preset.COMPLETE,
      });

      [
        'libs/my-tokens/style-dictionary.config.ts',
        'libs/my-tokens/src/tokens/color/background.json',
        'libs/my-tokens/src/tokens/color/base.json',
        'libs/my-tokens/src/tokens/color/border.json',
        'libs/my-tokens/src/tokens/color/brand.json',
        'libs/my-tokens/src/tokens/color/chart.json',
        'libs/my-tokens/src/tokens/color/font.json',
        'libs/my-tokens/src/tokens/size/font.json',
        'libs/my-tokens/src/tokens/size/icon.json',
        'libs/my-tokens/src/tokens/size/font.json',
        'libs/my-tokens/src/tokens/content/icon.json',
        'libs/my-tokens/src/tokens/font.json',
        'libs/my-tokens/src/tokens/time.json',
        'libs/my-tokens/src/assets/fonts/MaterialIcons-Regular.eot',
        'libs/my-tokens/src/assets/fonts/MaterialIcons-Regular.ttf',
        'libs/my-tokens/src/assets/fonts/MaterialIcons-Regular.woff',
        'libs/my-tokens/src/assets/fonts/MaterialIcons-Regular.woff2',
        'libs/my-tokens/src/assets/fonts/OpenSans-Regular.ttf',
        'libs/my-tokens/src/assets/fonts/Roboto-Regular.ttf',
      ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });
  });
});
