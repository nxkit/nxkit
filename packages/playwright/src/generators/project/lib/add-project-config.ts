import {
  addProjectConfiguration,
  joinPathFragments,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';
import { NormalizedProjectGeneratorSchema } from '../schema';

function createE2ETarget(
  options: NormalizedProjectGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nxkit/playwright:test',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', projectRoot),
      playwrightConfig: `${projectRoot}/playwright.config.ts`,
    },
  };
}

function createDebugTarget(
  options: NormalizedProjectGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nxkit/playwright:test',
    options: {
      outputPath: joinPathFragments('dist', projectRoot),
      playwrightConfig: `${projectRoot}/playwright.config.ts`,
      debug: true,
    },
  };
}

function createShowReportTarget(
  options: NormalizedProjectGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nxkit/playwright:show-report',
    options: {
      outputPath: joinPathFragments('dist', projectRoot),
    },
  };
}

function createLintTarget(
  options: NormalizedProjectGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nrwl/linter:eslint',
    outputs: ['{options.outputFile}'],
    options: {
      lintFilePatterns: [`${projectRoot}/**/*.{js,ts}`],
    },
  };
}

export function addProjectConfig(
  tree: Tree,
  normalizedOptions: NormalizedProjectGeneratorSchema
) {
  const { projectRoot } = normalizedOptions;

  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      e2e: createE2ETarget(normalizedOptions),
      debug: createDebugTarget(normalizedOptions),
      'show-report': createShowReportTarget(normalizedOptions),
      lint: createLintTarget(normalizedOptions),
    },
    tags: normalizedOptions.parsedTags,
  });
}
