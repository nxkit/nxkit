import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTestTokensLib } from '../../utils/testing/generators';
import { extensionGenerator } from './generator';
import { Extension, ExtensionGeneratorSchema } from './schema.d';

describe('Style Dictionary Extension', () => {
  let appTree: Tree;
  const defaultOptions: Omit<ExtensionGeneratorSchema, 'extensions'> = {
    project: 'my-tokens',
    directory: 'src/extensions',
  };

  beforeEach(async () => {
    appTree = await createTestTokensLib(defaultOptions.project, {
      appsLibsLayout: true,
    });
  });

  it('should generate files', async () => {
    await extensionGenerator(appTree, {
      ...defaultOptions,
      extensions: [
        Extension.ACTIONS,
        Extension.FILE_HEADERS,
        Extension.FILTERS,
        Extension.FORMATS,
        Extension.PARSERS,
        Extension.TRANSFORM_GROUPS,
        Extension.TRANSFORMS,
      ],
    });

    [
      `libs/${defaultOptions.project}/src/extensions/actions/index.ts`,
      `libs/${defaultOptions.project}/src/extensions/file-headers/index.ts`,
      `libs/${defaultOptions.project}/src/extensions/filters/index.ts`,
      `libs/${defaultOptions.project}/src/extensions/formats/index.ts`,
      `libs/${defaultOptions.project}/src/extensions/parsers/index.ts`,
      `libs/${defaultOptions.project}/src/extensions/transform-groups/index.ts`,
      `libs/${defaultOptions.project}/src/extensions/transforms/index.ts`,
    ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());
  });

  it('should update project configuration', async () => {
    await extensionGenerator(appTree, {
      ...defaultOptions,
      extensions: [
        Extension.ACTIONS,
        Extension.FILE_HEADERS,
        Extension.FILTERS,
        Extension.FORMATS,
        Extension.PARSERS,
        Extension.TRANSFORM_GROUPS,
        Extension.TRANSFORMS,
      ],
    });
    const config = readProjectConfiguration(appTree, defaultOptions.project);
    expect(config).toBeDefined();
    expect(config.targets.build.options.customActions).toBe(
      `libs/${defaultOptions.project}/src/extensions/actions/index.ts`
    );
    expect(config.targets.build.options.customFileHeaders).toBe(
      `libs/${defaultOptions.project}/src/extensions/file-headers/index.ts`
    );
    expect(config.targets.build.options.customFilters).toBe(
      `libs/${defaultOptions.project}/src/extensions/filters/index.ts`
    );
    expect(config.targets.build.options.customFormats).toBe(
      `libs/${defaultOptions.project}/src/extensions/formats/index.ts`
    );
    expect(config.targets.build.options.customParsers).toBe(
      `libs/${defaultOptions.project}/src/extensions/parsers/index.ts`
    );
    expect(config.targets.build.options.customTransformGroups).toBe(
      `libs/${defaultOptions.project}/src/extensions/transform-groups/index.ts`
    );
    expect(config.targets.build.options.customTransforms).toBe(
      `libs/${defaultOptions.project}/src/extensions/transforms/index.ts`
    );
  });

  describe('custom directory', () => {
    it('should generate files', async () => {
      await extensionGenerator(appTree, {
        ...defaultOptions,
        directory: 'src/custom-extensions',
        extensions: [Extension.ACTIONS],
      });

      expect(
        appTree.exists(
          `libs/${defaultOptions.project}/src/custom-extensions/actions/index.ts`
        )
      ).toBeTruthy();
    });

    it('should update project configuration', async () => {
      await extensionGenerator(appTree, {
        ...defaultOptions,
        directory: 'src/custom-extensions',
        extensions: [Extension.ACTIONS],
      });
      const config = readProjectConfiguration(appTree, defaultOptions.project);
      expect(config).toBeDefined();
      expect(config.targets.build.options.customActions).toBe(
        `libs/${defaultOptions.project}/src/custom-extensions/actions/index.ts`
      );
    });
  });

  describe('some extensions', () => {
    it('should generate files', async () => {
      await extensionGenerator(appTree, {
        ...defaultOptions,
        extensions: [
          Extension.ACTIONS,
          Extension.FILE_HEADERS,
          Extension.FILTERS,
        ],
      });

      [
        `libs/${defaultOptions.project}/src/extensions/actions/index.ts`,
        `libs/${defaultOptions.project}/src/extensions/file-headers/index.ts`,
        `libs/${defaultOptions.project}/src/extensions/filters/index.ts`,
      ].forEach((path) => expect(appTree.exists(path)).toBeTruthy());

      [
        `libs/${defaultOptions.project}/src/extensions/formats/index.ts`,
        `libs/${defaultOptions.project}/src/extensions/parsers/index.ts`,
        `libs/${defaultOptions.project}/src/extensions/transform-groups/index.ts`,
        `libs/${defaultOptions.project}/src/extensions/transforms/index.ts`,
      ].forEach((path) => expect(appTree.exists(path)).toBeFalsy());
    });

    it('should update project configuration', async () => {
      await extensionGenerator(appTree, {
        ...defaultOptions,
        extensions: [
          Extension.ACTIONS,
          Extension.FILE_HEADERS,
          Extension.FILTERS,
        ],
      });
      const config = readProjectConfiguration(appTree, defaultOptions.project);
      expect(config).toBeDefined();
      expect(config.targets.build.options.customActions).toBe(
        `libs/${defaultOptions.project}/src/extensions/actions/index.ts`
      );
      expect(config.targets.build.options.customFileHeaders).toBe(
        `libs/${defaultOptions.project}/src/extensions/file-headers/index.ts`
      );
      expect(config.targets.build.options.customFilters).toBe(
        `libs/${defaultOptions.project}/src/extensions/filters/index.ts`
      );
      expect(config.targets.build.options.customFormats).toBeUndefined();
      expect(config.targets.build.options.customParsers).toBeUndefined();
      expect(
        config.targets.build.options.customTransformGroups
      ).toBeUndefined();
      expect(config.targets.build.options.customTransforms).toBeUndefined();
    });
  });
});
