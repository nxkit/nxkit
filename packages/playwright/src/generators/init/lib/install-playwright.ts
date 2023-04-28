import { GeneratorCallback } from '@nx/devkit';
import { PlaywrightCLI } from '../../../utils/playwright';

export async function installPlaywright({
  force,
}: {
  force: boolean;
}): Promise<GeneratorCallback> {
  return async () => {
    await PlaywrightCLI.install({
      withDeps: true,
      force,
    });
  };
}
