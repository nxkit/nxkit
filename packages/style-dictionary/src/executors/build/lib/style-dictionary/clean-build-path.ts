import { Platform } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../schema';
import { rmSync, existsSync } from 'fs';

export function cleanPlatformBuildPath(
  platform: Platform,
  options: NormalizedBuildExecutorSchema
) {
  if (platform.buildPath && platform.buildPath !== options.outputPath) {
    if (existsSync(platform.buildPath)) {
      rmSync(platform.buildPath);
    }
  }
}
