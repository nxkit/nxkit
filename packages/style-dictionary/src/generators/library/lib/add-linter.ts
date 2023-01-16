import { joinPathFragments, Tree } from '@nrwl/devkit';
import { Linter, lintProjectGenerator } from '@nrwl/linter';
import { NormalizedLibraryGeneratorSchema } from '../schema';

export async function addLinter(
  tree: Tree,
  normalizedOptions: NormalizedLibraryGeneratorSchema
) {
  const { projectName, projectRoot, linter } = normalizedOptions;

  if (!linter || linter === Linter.None) {
    return;
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
