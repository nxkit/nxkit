import { GeneratorCallback } from '@nrwl/devkit';
import { PlaywrightCLI } from '../../../utils/playwright';

export async function installPlaywright({
  force,
}: {
  force: boolean;
}): Promise<GeneratorCallback> {
  return () => {
    PlaywrightCLI.install({
      withDeps: true,
      force,
    });
  };
}
