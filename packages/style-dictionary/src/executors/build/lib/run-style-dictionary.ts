import * as styleDictionary from 'style-dictionary';

export function runBuild(config: styleDictionary.Config, platform?: string) {
  const instance = styleDictionary.extend(config);

  if (platform) {
    instance.cleanPlatform(platform).buildPlatform(platform);
    return;
  }
  instance.cleanAllPlatforms().buildAllPlatforms();
}
