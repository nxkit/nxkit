import { Platform } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../schema';
import { rmSync } from 'fs';

export function cleanPlatformBuildPath(
  platform: Platform,
  options: NormalizedBuildExecutorSchema
) {
  if (platform.buildPath && platform.buildPath !== options.outputPath) {
    rmSync(platform.buildPath);
  }
}
