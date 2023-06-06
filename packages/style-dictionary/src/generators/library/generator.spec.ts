import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import {
  Tree,
  readProjectConfiguration,
  readJson,
  joinPathFragments,
} from '@nx/devkit';

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

    expect(projectConfig.targets.build).toEqual({
      executor: '@nxkit/style-dictionary:build',
      outputs: ['{options.outputPath}'],
      options: {
        outputPath: 'dist/libs/my-tokens',
        styleDictionaryConfig: 'libs/my-tokens/style-dictionary.config.ts',
        tsConfig: 'libs/my-tokens/tsconfig.json',
      },
    });

    expect(projectConfig.targets.lint).toEqual({
      executor: '@nx/linter:eslint',
      outputs: ['{options.outputFile}'],
      options: {
        lintFilePatterns: ['libs/my-tokens/**/*.{js,ts}'],
      },
    });
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

  it('should add tags', async () => {
    await libraryGenerator(appTree, {
      ...defaultOptions,
      name: 'my-tokens',
      tags: 'type:ui-tokens,scope:tokens',
    });

    const project = readProjectConfiguration(appTree, 'my-tokens');
    expect(project.tags).toEqual(['type:ui-tokens', 'scope:tokens']);
  });

  it('should set right path names in `style-dictionary.config.ts`', async () => {
    await libraryGenerator(appTree, {
      ...defaultOptions,
      name: 'my-tokens',
    });
    const styleDictionaryConfig = appTree.read(
      'libs/my-tokens/style-dictionary.config.ts',
      'utf-8'
    );
    expect(styleDictionaryConfig).toMatchSnapshot();
  });

  it('should set right path names in `tsconfig.lib.json`', async () => {
    await libraryGenerator(appTree, {
      ...defaultOptions,
      name: 'my-tokens',
    });
    const tsconfigLibJson = readJson(
      appTree,
      'libs/my-tokens/tsconfig.lib.json'
    );
    expect(tsconfigLibJson).toMatchSnapshot();
  });

  it('should extend from tsconfig.base.json', async () => {
    await libraryGenerator(appTree, {
      ...defaultOptions,
      name: 'my-tokens',
    });

    const tsConfig = readJson(appTree, 'libs/my-tokens/tsconfig.json');
    expect(tsConfig.extends).toBe('../../tsconfig.base.json');
  });

  describe('--directory', () => {
    it('should generate in the right directory', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        directory: 'my-dir',
      });

      const project = readProjectConfiguration(appTree, 'my-dir-my-tokens');
      expect(project).toBeDefined();
      expect(project.root).toEqual('libs/my-dir/my-tokens');
      expect(project.sourceRoot).toEqual('libs/my-dir/my-tokens/src');
      expect(project.targets.build.options.outputPath).toEqual(
        'dist/libs/my-dir/my-tokens'
      );

      [
        'libs/my-dir/my-tokens/style-dictionary.config.ts',
        'libs/my-dir/my-tokens/src/tokens/color/base.json',
        'libs/my-dir/my-tokens/src/tokens/color/font.json',
        'libs/my-dir/my-tokens/src/tokens/size/font.json',
      ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });

    it('should generate in nested --directory', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        directory: 'foo/bar',
      });

      const project = readProjectConfiguration(appTree, 'foo-bar-my-tokens');
      expect(project).toBeDefined();
      expect(project.root).toEqual('libs/foo/bar/my-tokens');
      expect(project.sourceRoot).toEqual('libs/foo/bar/my-tokens/src');
      expect(project.targets.build.options.outputPath).toEqual(
        'dist/libs/foo/bar/my-tokens'
      );

      [
        'libs/foo/bar/my-tokens/style-dictionary.config.ts',
        'libs/foo/bar/my-tokens/src/tokens/color/base.json',
        'libs/foo/bar/my-tokens/src/tokens/color/font.json',
        'libs/foo/bar/my-tokens/src/tokens/size/font.json',
      ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });

    it('should set right path names in `style-dictionary.config.ts`', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        directory: 'my-dir',
      });
      const styleDictionaryConfig = appTree.read(
        'libs/my-dir/my-tokens/style-dictionary.config.ts',
        'utf-8'
      );
      expect(styleDictionaryConfig).toMatchSnapshot();
    });

    it('should set right path names in `tsconfig.lib.json`', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        directory: 'my-dir',
      });
      const tsconfigLibJson = readJson(
        appTree,
        'libs/my-dir/my-tokens/tsconfig.lib.json'
      );
      expect(tsconfigLibJson).toMatchSnapshot();
    });

    it('should extend from tsconfig.base.json', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        directory: 'my-dir',
      });

      const tsConfig = readJson(appTree, 'libs/my-dir/my-tokens/tsconfig.json');
      expect(tsConfig.extends).toBe('../../../tsconfig.base.json');
    });
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
        'libs/my-tokens/src/extensions/actions/index.ts',
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

    it('should set right path names in `style-dictionary.config.ts`', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        preset: Preset.COMPLETE,
      });
      const styleDictionaryConfig = appTree.read(
        'libs/my-tokens/style-dictionary.config.ts',
        'utf-8'
      );
      expect(styleDictionaryConfig).toMatchSnapshot();
    });

    describe('--directory', () => {
      it('should generate in the right directory', async () => {
        await libraryGenerator(appTree, {
          ...defaultOptions,
          name: 'my-tokens',
          directory: 'my-dir',
          preset: Preset.COMPLETE,
        });

        [
          'libs/my-dir/my-tokens/style-dictionary.config.ts',
          'libs/my-dir/my-tokens/src/extensions/actions/index.ts',
          'libs/my-dir/my-tokens/src/tokens/color/background.json',
          'libs/my-dir/my-tokens/src/tokens/color/base.json',
          'libs/my-dir/my-tokens/src/tokens/color/border.json',
          'libs/my-dir/my-tokens/src/tokens/color/brand.json',
          'libs/my-dir/my-tokens/src/tokens/color/chart.json',
          'libs/my-dir/my-tokens/src/tokens/color/font.json',
          'libs/my-dir/my-tokens/src/tokens/size/font.json',
          'libs/my-dir/my-tokens/src/tokens/size/icon.json',
          'libs/my-dir/my-tokens/src/tokens/size/font.json',
          'libs/my-dir/my-tokens/src/tokens/content/icon.json',
          'libs/my-dir/my-tokens/src/tokens/font.json',
          'libs/my-dir/my-tokens/src/tokens/time.json',
          'libs/my-dir/my-tokens/src/assets/fonts/MaterialIcons-Regular.eot',
          'libs/my-dir/my-tokens/src/assets/fonts/MaterialIcons-Regular.ttf',
          'libs/my-dir/my-tokens/src/assets/fonts/MaterialIcons-Regular.woff',
          'libs/my-dir/my-tokens/src/assets/fonts/MaterialIcons-Regular.woff2',
          'libs/my-dir/my-tokens/src/assets/fonts/OpenSans-Regular.ttf',
          'libs/my-dir/my-tokens/src/assets/fonts/Roboto-Regular.ttf',
        ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
      });
    });
  });

  describe('--preset multiconfig', () => {
    it('should generate project files', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        preset: Preset.MULTICONFIG,
      });

      [
        'libs/my-tokens/style-dictionary.config.ts',
        'libs/my-tokens/src/tokens/brand-1/light/color/base.json',
        'libs/my-tokens/src/tokens/brand-1/light/color/font.json',
        'libs/my-tokens/src/tokens/brand-1/light/size/font.json',
        'libs/my-tokens/src/tokens/brand-1/dark/color/base.json',
        'libs/my-tokens/src/tokens/brand-1/dark/color/font.json',
        'libs/my-tokens/src/tokens/brand-1/dark/size/font.json',
      ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });

    it('should set right path names in `style-dictionary.config.ts`', async () => {
      await libraryGenerator(appTree, {
        ...defaultOptions,
        name: 'my-tokens',
        preset: Preset.MULTICONFIG,
      });
      const styleDictionaryConfig = appTree.read(
        'libs/my-tokens/style-dictionary.config.ts',
        'utf-8'
      );
      expect(styleDictionaryConfig).toMatchSnapshot();
    });

    describe('--directory', () => {
      it('should generate in the right directory', async () => {
        await libraryGenerator(appTree, {
          ...defaultOptions,
          name: 'my-tokens',
          directory: 'my-dir',
          preset: Preset.MULTICONFIG,
        });

        [
          'libs/my-dir/my-tokens/style-dictionary.config.ts',
          'libs/my-dir/my-tokens/src/tokens/brand-1/light/color/base.json',
          'libs/my-dir/my-tokens/src/tokens/brand-1/light/color/font.json',
          'libs/my-dir/my-tokens/src/tokens/brand-1/light/size/font.json',
          'libs/my-dir/my-tokens/src/tokens/brand-1/dark/color/base.json',
          'libs/my-dir/my-tokens/src/tokens/brand-1/dark/color/font.json',
          'libs/my-dir/my-tokens/src/tokens/brand-1/dark/size/font.json',
        ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
      });
    });

    describe('should be able to resolve directory path based on the workspace layout', () => {
      test.each`
        directory             | expectedProjectName | projectRoot
        ${'/shared'}          | ${'shared-mylib'}   | ${'libs/shared/mylib'}
        ${'libs'}             | ${'mylib'}          | ${'libs/mylib'}
        ${'/libs/shared'}     | ${'shared-mylib'}   | ${'libs/shared/mylib'}
        ${'libs/shared'}      | ${'shared-mylib'}   | ${'libs/shared/mylib'}
        ${'/packages'}        | ${'mylib'}          | ${'packages/mylib'}
        ${'/packages/shared'} | ${'shared-mylib'}   | ${'packages/shared/mylib'}
      `(
        'when directory is "$directory" should generate "$expectedProjectName" with project\'s root at "$projectRoot"',
        async ({ directory, expectedProjectName, projectRoot }) => {
          await libraryGenerator(appTree, {
            ...defaultOptions,
            name: 'mylib',
            directory,
          });
          const config = readProjectConfiguration(appTree, expectedProjectName);

          expect(config.root).toBe(projectRoot);
          expect(config).toMatchSnapshot(
            JSON.stringify(directory, expectedProjectName)
          );
          expect(
            appTree.exists(
              joinPathFragments(projectRoot, 'style-dictionary.config.ts')
            )
          ).toBeTruthy();
        }
      );
    });
  });
});
