import { GeneratorCallback } from '@nrwl/devkit';
import { PlaywrightCLI } from '../../../utils/playwright';

export function installPlaywright({
  force,
}: {
  force: boolean;
}): GeneratorCallback {
  return () => {
    console.log('I was called 4');
    PlaywrightCLI.install({
      withDeps: true,
      force,
    });
  };
}
