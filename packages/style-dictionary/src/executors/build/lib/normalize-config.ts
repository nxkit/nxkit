import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { resolve } from 'path';
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
    source: config.source.map((src) => resolve(projectRoot, src)),
    include: config?.include?.map((include) => resolve(projectRoot, include)),
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
