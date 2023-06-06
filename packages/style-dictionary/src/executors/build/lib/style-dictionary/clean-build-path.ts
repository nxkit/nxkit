import { Platform } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../schema';
import { existsSync } from 'fs';
import { deleteOutputDir } from '../../../../utils/fs/delete-output-path';

export function cleanPlatformBuildPath(
  platform: Platform,
  options: NormalizedBuildExecutorSchema
) {
  if (platform.buildPath && platform.buildPath !== options.outputPath) {
    if (existsSync(platform.buildPath)) {
      deleteOutputDir(options.root, platform.buildPath);
    }
  }
}
