import { ExecutorContext } from '@nrwl/devkit';
import * as styleDictionary from 'style-dictionary';
import { Config } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../schema';
import { registerExtensions } from './register-extensions';

export function runBuild(
  config: Config[],
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  registerExtensions(styleDictionary, options, context);

  config.forEach((currentConfig) => {
    const instance = styleDictionary.extend(currentConfig);
    const { platform } = options;

    if (platform) {
      instance.buildPlatform(platform);
      return;
    }
    instance.buildAllPlatforms();
  });
}
