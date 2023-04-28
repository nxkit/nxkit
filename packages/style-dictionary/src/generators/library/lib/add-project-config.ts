import {
  addProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  Tree,
} from '@nx/devkit';
import { NormalizedLibraryGeneratorSchema } from '../schema';

function createBuildTarget(
  options: NormalizedLibraryGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nxkit/style-dictionary:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', projectRoot),
      styleDictionaryConfig: `${projectRoot}/style-dictionary.config.ts`,
      tsConfig: `${projectRoot}/tsconfig.json`,
    },
  };
}

function createLintTarget(
  options: NormalizedLibraryGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nx/linter:eslint',
    outputs: ['{options.outputFile}'],
    options: {
      lintFilePatterns: [`${projectRoot}/**/*.{js,ts}`],
    },
  };
}

export function addProjectConfig(
  tree: Tree,
  normalizedOptions: NormalizedLibraryGeneratorSchema
) {
  const { projectRoot } = normalizedOptions;

  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: createBuildTarget(normalizedOptions),
      lint: createLintTarget(normalizedOptions),
    },
    tags: normalizedOptions.parsedTags,
  });
}
