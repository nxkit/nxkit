import { joinPathFragments, Tree } from '@nrwl/devkit';
import { Linter, lintProjectGenerator } from '@nrwl/linter';
import { NormalizedProjectGeneratorSchema } from '../schema';

export async function addLinter(
  tree: Tree,
  normalizedOptions: NormalizedProjectGeneratorSchema
) {
  const { projectName, projectRoot, linter } = normalizedOptions;

  if (!linter || linter === Linter.None) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const installTask = await lintProjectGenerator(tree, {
    project: projectName,
    linter,
    skipFormat: true,
    tsConfigPaths: [joinPathFragments(projectRoot, 'tsconfig.json')],
    eslintFilePatterns: [`${projectRoot}/**/*.{js,ts}`],
  });

  return installTask;
}
