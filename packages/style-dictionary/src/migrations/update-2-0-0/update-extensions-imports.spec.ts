import { addProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { update } from './update-extensions-imports';

describe('Remove deprecated hook testing package', () => {
  it('should replace imports for packages that has jest test target', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(
      tree,
      'example',
      {
        root: 'apps/example',
        sourceRoot: 'apps/example/src',
        projectType: 'application',
        targets: {
          build: {
            executor: '@nxkit/style-dictionary:build',
            options: {
              tsConfig: 'libs/example/tsconfig.json',
              customActions: 'libs/example/src/extensions/actions/index.ts',
              customFileHeaders:
                'libs/example/src/extensions/file-headers/index.ts',
              customFilters: 'libs/example/src/extensions/filters/index.ts',
              customFormats: 'libs/example/src/extensions/formats/index.ts',
              customParsers: 'libs/example/src/extensions/parsers/index.ts',
              customTransformGroups:
                'libs/example/src/extensions/transform-groups/index.ts',
              customTransforms:
                'libs/example/src/extensions/transforms/index.ts',
            },
          },
        },
      },
      true
    );

    const extensionsFiles = [
      'libs/example/src/extensions/actions/index.ts',
      'libs/example/src/extensions/actions/copy_files_action.ts',
      'libs/example/src/extensions/file-headers/index.ts',
      'libs/example/src/extensions/filters/index.ts',
      'libs/example/src/extensions/formats/index.ts',
      'libs/example/src/extensions/parsers/index.ts',
      'libs/example/src/extensions/transform-groups/index.ts',
      'libs/example/src/extensions/transforms/index.ts',
    ];

    extensionsFiles.forEach((path) => {
      tree.write(
        path,
        `import { ExtensionContext } from '@nxkit/style-dictionary';`
      );
    });

    await update(tree);

    extensionsFiles.forEach((path) => {
      expect(tree.read(path).toString()).toEqual(
        `import { ExtensionContext } from '@nxkit/style-dictionary/extensions';`
      );
    });
  });
});
