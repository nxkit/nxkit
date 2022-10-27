import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { getProjectRoots } from 'nx/src/utils/command-line-utils';
import { resolve } from 'path';
import * as StyleDictionary from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../schema';

export function normalizeStyleDictionaryConfig(
  config: StyleDictionary.Config,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
): StyleDictionary.Config {
  const [projectRoot] = getProjectRoots(
    [context.projectName],
    context.projectGraph
  );
  const normalized: StyleDictionary.Config = {
    ...config,
    source: config.source.map((src) => resolve(projectRoot, src)),
    platforms: Object.entries(config.platforms).reduce(
      (
        accum: { [key: string]: StyleDictionary.Platform },
        [name, platform]
      ) => {
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
