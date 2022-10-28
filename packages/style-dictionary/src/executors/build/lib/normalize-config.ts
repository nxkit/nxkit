import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { getProjectRoots } from 'nx/src/utils/command-line-utils';
import { resolve } from 'path';
import { Config, Platform } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../schema';

export function normalizeStyleDictionaryConfig(
  config: Config,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
): Config {
  const [projectRoot] = getProjectRoots(
    [context.projectName],
    context.projectGraph
  );
  const normalized: Config = {
    ...config,
    source: config.source.map((src) => resolve(projectRoot, src)),
    platforms: Object.entries(config.platforms).reduce(
      (accum: { [key: string]: Platform }, [name, platform]) => {
        return {
          ...accum,
          [name]: {
            ...platform,
            buildPath: joinPathFragments(
              options.outputPath,
              platform.buildPath
            ),
          },
        };
      },
      {}
    ),
  };
  return normalized;
}
