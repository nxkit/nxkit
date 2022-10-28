import { ExecutorContext } from '@nrwl/devkit';
import * as styleDictionary from 'style-dictionary';
import { Config } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../schema';
import { registerExtensions } from './register-extensions';

export function runBuild(
  config: Config,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const instance = styleDictionary.extend(config);
  const { platform } = options;

  registerExtensions(instance, options, context);

  if (platform) {
    instance.buildPlatform(platform);
    return;
  }
  instance.buildAllPlatforms();
}
