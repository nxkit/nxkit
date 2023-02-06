import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
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
      const result = await runNxCommandAsync(`build ${project}`);
      expect(result.stdout).toContain('Successfully built design tokens');
      expect(() => {
        checkFilesExist(
          `dist/libs/${project}/android/font_dimens.xml`,
          `dist/libs/${project}/android/colors.xml`,
          `dist/libs/${project}/compose/StyleDictionaryColor.kt`,
          `dist/libs/${project}/compose/StyleDictionarySize.kt`,
          `dist/libs/${project}/ios/StyleDictionaryColor.h`,
          `dist/libs/${project}/ios/StyleDictionaryColor.m`,
          `dist/libs/${project}/ios/StyleDictionarySize.h`,
          `dist/libs/${project}/ios/StyleDictionarySize.m`,
          `dist/libs/${project}/ios-swift/StyleDictionary+Class.swift`,
          `dist/libs/${project}/ios-swift/StyleDictionary+Enum.swift`,
          `dist/libs/${project}/ios-swift/StyleDictionary+Struct.swift`,
          `dist/libs/${project}/ios-swift/StyleDictionaryColor.swift`,
          `dist/libs/${project}/ios-swift/StyleDictionarySize.swift`,
          `dist/libs/${project}/scss/_variables.scss`
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
            `dist/libs/${project}/android/font_dimens.xml`,
            `dist/libs/${project}/android/colors.xml`,
            `dist/libs/${project}/compose/StyleDictionaryColor.kt`,
            `dist/libs/${project}/compose/StyleDictionarySize.kt`,
            `dist/libs/${project}/ios/StyleDictionaryColor.h`,
            `dist/libs/${project}/ios/StyleDictionaryColor.m`,
            `dist/libs/${project}/ios/StyleDictionarySize.h`,
            `dist/libs/${project}/ios/StyleDictionarySize.m`,
            `dist/libs/${project}/ios-swift/StyleDictionary+Class.swift`,
            `dist/libs/${project}/ios-swift/StyleDictionary+Enum.swift`,
            `dist/libs/${project}/ios-swift/StyleDictionary+Struct.swift`,
            `dist/libs/${project}/ios-swift/StyleDictionaryColor.swift`,
            `dist/libs/${project}/ios-swift/StyleDictionarySize.swift`,
            `dist/libs/${project}/scss/_variables.scss`
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
        `generate @nxkit/style-dictionary:library ${project} --directory subdir`
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
