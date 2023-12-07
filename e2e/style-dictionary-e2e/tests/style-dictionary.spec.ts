import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nx/plugin/testing';
import { DEFAULT_TIMEOUT } from '@nxkit/e2e/utils';

describe('style-dictionary e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject(
      '@nxkit/style-dictionary',
      'dist/packages/style-dictionary'
    );
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it(
    'should create project',
    async () => {
      const project = uniq('style-dictionary');
      await runNxCommandAsync(
        `generate @nxkit/style-dictionary:library ${project}`
      );

      expect(() => checkFilesExist(`tsconfig.base.json`)).not.toThrow();

      const result = await runNxCommandAsync(`build ${project}`);
      expect(result.stdout).toContain('Successfully built design tokens');
      expect(() => {
        checkFilesExist(
          `dist/${project}/android/font_dimens.xml`,
          `dist/${project}/android/colors.xml`,
          `dist/${project}/compose/StyleDictionaryColor.kt`,
          `dist/${project}/compose/StyleDictionarySize.kt`,
          `dist/${project}/ios/StyleDictionaryColor.h`,
          `dist/${project}/ios/StyleDictionaryColor.m`,
          `dist/${project}/ios/StyleDictionarySize.h`,
          `dist/${project}/ios/StyleDictionarySize.m`,
          `dist/${project}/ios-swift/StyleDictionary+Class.swift`,
          `dist/${project}/ios-swift/StyleDictionary+Enum.swift`,
          `dist/${project}/ios-swift/StyleDictionary+Struct.swift`,
          `dist/${project}/ios-swift/StyleDictionaryColor.swift`,
          `dist/${project}/ios-swift/StyleDictionarySize.swift`,
          `dist/${project}/scss/_variables.scss`
        );
      }).not.toThrow();
    },
    DEFAULT_TIMEOUT
  );

  it(
    'should create multi config project',
    async () => {
      const project = uniq('style-dictionary');
      await runNxCommandAsync(
        `generate @nxkit/style-dictionary:library ${project} --preset=multiconfig`
      );

      expect(() => checkFilesExist(`tsconfig.base.json`)).not.toThrow();

      const result = await runNxCommandAsync(`build ${project}`);
      expect(result.stdout).toContain('Successfully built design tokens');
      expect(() => {
        checkFilesExist(
          `dist/${project}/brand-1/light/android/font_dimens.xml`,
          `dist/${project}/brand-1/light/android/colors.xml`,
          `dist/${project}/brand-1/light/compose/StyleDictionaryColor.kt`,
          `dist/${project}/brand-1/light/compose/StyleDictionarySize.kt`,
          `dist/${project}/brand-1/light/ios/StyleDictionaryColor.h`,
          `dist/${project}/brand-1/light/ios/StyleDictionaryColor.m`,
          `dist/${project}/brand-1/light/ios/StyleDictionarySize.h`,
          `dist/${project}/brand-1/light/ios/StyleDictionarySize.m`,
          `dist/${project}/brand-1/light/ios-swift/StyleDictionary+Class.swift`,
          `dist/${project}/brand-1/light/ios-swift/StyleDictionary+Enum.swift`,
          `dist/${project}/brand-1/light/ios-swift/StyleDictionary+Struct.swift`,
          `dist/${project}/brand-1/light/ios-swift/StyleDictionaryColor.swift`,
          `dist/${project}/brand-1/light/ios-swift/StyleDictionarySize.swift`,
          `dist/${project}/brand-1/light/scss/_variables.scss`,
          `dist/${project}/brand-1/dark/android/font_dimens.xml`,
          `dist/${project}/brand-1/dark/android/colors.xml`,
          `dist/${project}/brand-1/dark/compose/StyleDictionaryColor.kt`,
          `dist/${project}/brand-1/dark/compose/StyleDictionarySize.kt`,
          `dist/${project}/brand-1/dark/ios/StyleDictionaryColor.h`,
          `dist/${project}/brand-1/dark/ios/StyleDictionaryColor.m`,
          `dist/${project}/brand-1/dark/ios/StyleDictionarySize.h`,
          `dist/${project}/brand-1/dark/ios/StyleDictionarySize.m`,
          `dist/${project}/brand-1/dark/ios-swift/StyleDictionary+Class.swift`,
          `dist/${project}/brand-1/dark/ios-swift/StyleDictionary+Enum.swift`,
          `dist/${project}/brand-1/dark/ios-swift/StyleDictionary+Struct.swift`,
          `dist/${project}/brand-1/dark/ios-swift/StyleDictionaryColor.swift`,
          `dist/${project}/brand-1/dark/ios-swift/StyleDictionarySize.swift`,
          `dist/${project}/brand-1/dark/scss/_variables.scss`
        );
      }).not.toThrow();
    },
    DEFAULT_TIMEOUT
  );

  describe('extensions', () => {
    it(
      'should create extensions',
      async () => {
        const project = uniq('style-dictionary');
        await runNxCommandAsync(
          `generate @nxkit/style-dictionary:library ${project}`
        );

        const extensions = [
          'actions',
          'file-headers',
          'filters',
          'formats',
          'parsers',
          'transform-groups',
          'transforms',
        ];

        await runNxCommandAsync(
          `generate @nxkit/style-dictionary:extension --project ${project} --extensions ${extensions.join(
            ','
          )}`
        );

        const result = await runNxCommandAsync(`build ${project}`);
        expect(result.stdout).toContain('Successfully built design tokens');
        expect(() => {
          checkFilesExist(
            `dist/${project}/android/font_dimens.xml`,
            `dist/${project}/android/colors.xml`,
            `dist/${project}/compose/StyleDictionaryColor.kt`,
            `dist/${project}/compose/StyleDictionarySize.kt`,
            `dist/${project}/ios/StyleDictionaryColor.h`,
            `dist/${project}/ios/StyleDictionaryColor.m`,
            `dist/${project}/ios/StyleDictionarySize.h`,
            `dist/${project}/ios/StyleDictionarySize.m`,
            `dist/${project}/ios-swift/StyleDictionary+Class.swift`,
            `dist/${project}/ios-swift/StyleDictionary+Enum.swift`,
            `dist/${project}/ios-swift/StyleDictionary+Struct.swift`,
            `dist/${project}/ios-swift/StyleDictionaryColor.swift`,
            `dist/${project}/ios-swift/StyleDictionarySize.swift`,
            `dist/${project}/scss/_variables.scss`
          );
        }).not.toThrow();
      },
      DEFAULT_TIMEOUT
    );
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('style-dictionary');
      await runNxCommandAsync(
        `generate @nxkit/style-dictionary:library ${project} --directory libs/subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${project}/style-dictionary.config.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it(
      'should add tags to the project',
      async () => {
        const projectName = uniq('style-dictionary');
        await runNxCommandAsync(
          `generate @nxkit/style-dictionary:library ${projectName} --tags e2etag,e2ePackage`
        );
        const project = readJson(`libs/${projectName}/project.json`);
        expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
      },
      DEFAULT_TIMEOUT
    );
  });
});
