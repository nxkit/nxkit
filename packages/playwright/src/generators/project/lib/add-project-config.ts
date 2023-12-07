import {
  addProjectConfiguration,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  stripIndents,
  TargetConfiguration,
  Tree,
} from '@nx/devkit';
import { NormalizedProjectGeneratorSchema } from '../schema';

function createE2ETarget(
  options: NormalizedProjectGeneratorSchema,
  devServerTarget: string | undefined
): TargetConfiguration {
  const { projectRoot, frontendProject } = options;
  return {
    executor: '@nxkit/playwright:test',
    outputs: ['{workspaceRoot}/dist/{projectRoot}'],
    options: {
      outputPath: joinPathFragments('dist', projectRoot, 'test-results'),
      playwrightConfig: `${projectRoot}/playwright.config.ts`,
      ...(devServerTarget
        ? { devServerTarget }
        : { baseUrl: options.baseUrl ?? 'https://example.com' }),
    },
    configurations: {
      production: {
        ...(devServerTarget
          ? {
              devServerTarget: frontendProject
                ? `${frontendProject}:serve:production`
                : undefined,
            }
          : { baseUrl: options.baseUrl ?? 'https://example.com' }),
      },
    },
  };
}

function createDebugTarget(
  options: NormalizedProjectGeneratorSchema,
  devServerTarget: string | undefined
): TargetConfiguration {
  const e2eTarget = createE2ETarget(options, devServerTarget);
  e2eTarget.options.debug = true;
  return e2eTarget;
}

function createShowReportTarget(
  options: NormalizedProjectGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nxkit/playwright:show-report',
    options: {
      reportPath: joinPathFragments('dist', projectRoot, 'playwright-report'),
    },
  };
}

function createLintTarget(
  options: NormalizedProjectGeneratorSchema
): TargetConfiguration {
  const { projectRoot } = options;
  return {
    executor: '@nx/eslint:eslint',
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
  const { projectRoot, frontendProject } = normalizedOptions;

  let devServerTarget = undefined;

  if (!normalizedOptions.baseUrl && normalizedOptions.frontendProject) {
    const frontendProjectConfig = readProjectConfiguration(
      tree,
      normalizedOptions.frontendProject
    );

    if (!frontendProjectConfig.targets) {
      logger.warn(stripIndents`
      NOTE: Project, "${frontendProject}", does not have any targets defined and a baseUrl was not provided. Nx will use
      "${frontendProject}:serve" as the devServerTarget. But you may need to define this target within the project, "${frontendProject}".
      `);
    }

    devServerTarget =
      frontendProjectConfig.targets?.serve &&
      frontendProjectConfig.targets?.serve?.defaultConfiguration
        ? `${frontendProject}:serve:${frontendProjectConfig.targets.serve.defaultConfiguration}`
        : `${frontendProject}:serve`;
  }

  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      e2e: createE2ETarget(normalizedOptions, devServerTarget),
      debug: createDebugTarget(normalizedOptions, devServerTarget),
      'show-report': createShowReportTarget(normalizedOptions),
      lint: createLintTarget(normalizedOptions),
    },
    tags: normalizedOptions.parsedTags,
    implicitDependencies: frontendProject ? [frontendProject] : undefined,
  });
}
