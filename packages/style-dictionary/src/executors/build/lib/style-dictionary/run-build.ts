import { Config } from 'style-dictionary';
import * as styleDictionary from 'style-dictionary';

export function runBuild(config: Config, platform?: string) {
  const instance = styleDictionary.extend(config);

  if (platform) {
    instance.buildPlatform(platform);
    return;
  }
  instance.buildAllPlatforms();
}
