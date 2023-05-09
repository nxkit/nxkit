import { ExecutorContext } from '@nx/devkit';
import * as styleDictionary from 'style-dictionary';
import { Config } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../schema';
import { cleanPlatformBuildPath } from './clean-build-path';
import { registerExtensions } from './register-extensions';

export function runBuild(
  configs: Config[],
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  registerExtensions(styleDictionary, options, context);

  configs.forEach((currentConfig) => {
    const instance = styleDictionary.extend(currentConfig);
    const { platform } = options;

    if (platform) {
      const platformConfig = currentConfig.platforms[platform];
      if (options.deleteOutputPath) {
        cleanPlatformBuildPath(platformConfig, options);
      }
      instance.buildPlatform(platform);
      return;
    }

    if (options.deleteOutputPath) {
      Object.values(currentConfig.platforms).forEach((platformConfig) => {
        cleanPlatformBuildPath(platformConfig, options);
      });
    }

    instance.buildAllPlatforms();
  });
}
