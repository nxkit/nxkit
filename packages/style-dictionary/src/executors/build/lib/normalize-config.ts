import { ExecutorContext, joinPathFragments } from '@nx/devkit';
import { posix } from 'path';
import type { Config, Platform } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../schema';

export function normalizeStyleDictionaryConfig(
  config: Config,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
): Config {
  const { root: projectRoot } = context.workspace.projects[context.projectName];
  const normalized: Config = {
    ...config,
    source: config.source.map((src) => posix.resolve(projectRoot, src)),
    include: config?.include?.map((include) =>
      posix.resolve(projectRoot, include)
    ),
    platforms: Object.entries(config.platforms).reduce(
      (accum: { [key: string]: Platform }, [name, platform]) => ({
        ...accum,
        [name]: {
          ...platform,
          buildPath: joinPathFragments(options.outputPath, platform.buildPath),
        },
      }),
      {}
    ),
  };
  return normalized;
}
