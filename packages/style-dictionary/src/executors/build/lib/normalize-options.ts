import { ExecutorContext } from '@nrwl/devkit';
import { resolve } from 'path';

import type {
  BuildExecutorSchema,
  NormalizedBuildExecutorSchema,
} from '../schema';

export function normalizeOptions(
  options: BuildExecutorSchema,
  context: ExecutorContext
): NormalizedBuildExecutorSchema {
  const projectConfig = context.workspace.projects[context.projectName];
  const { sourceRoot, root: projectRoot } = projectConfig;
  const { root } = context;
  return {
    ...options,
    root,
    projectRoot,
    sourceRoot,
    outputPath: resolve(root, options.outputPath),
    styleDictionaryConfig: resolve(root, options.styleDictionaryConfig),
    tsConfig: resolve(root, options.tsConfig),
  };
}

export function normalizePluginPath(pluginPath: void | string, root: string) {
  if (!pluginPath) {
    return '';
  }
  try {
    return require.resolve(pluginPath);
  } catch {
    return resolve(root, pluginPath);
  }
}
