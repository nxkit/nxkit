import { GeneratorCallback } from '@nrwl/devkit';
import { PlaywrightCLI } from '../../../utils/playwright';

export function installPlaywright({
  force,
}: {
  force: boolean;
}): GeneratorCallback {
  return () => {
    PlaywrightCLI.install({
      withDeps: true,
      force,
    });
  };
}
