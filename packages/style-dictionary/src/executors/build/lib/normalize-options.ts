import { resolve } from 'path';

import type {
  BuildExecutorSchema,
  NormalizedBuildExecutorSchema,
} from '../schema';

export function normalizeOptions(
  options: BuildExecutorSchema,
  root: string,
  sourceRoot: string
): NormalizedBuildExecutorSchema {
  return {
    ...options,
    root,
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
