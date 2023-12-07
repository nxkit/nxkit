import { joinPathFragments, Tree } from '@nx/devkit';
import { Linter, lintProjectGenerator } from '@nx/eslint';
import { NormalizedLibraryGeneratorSchema } from '../schema';

export async function addLinter(
  tree: Tree,
  normalizedOptions: NormalizedLibraryGeneratorSchema
) {
  const { projectName, projectRoot, linter } = normalizedOptions;

  if (!linter || linter === Linter.None) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const installTask = await lintProjectGenerator(tree, {
    project: projectName,
    linter: Linter.EsLint,
    skipFormat: true,
    tsConfigPaths: [joinPathFragments(projectRoot, 'tsconfig.json')],
    eslintFilePatterns: [`${projectRoot}/**/*.{js,ts}`],
  });

  return installTask;
}
