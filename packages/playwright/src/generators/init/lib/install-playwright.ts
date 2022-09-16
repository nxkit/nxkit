import { GeneratorCallback } from '@nrwl/devkit';
import { execSync } from 'child_process';

export function installPlaywright(): GeneratorCallback {
  return () => {
    const args = ['--with-deps'];
    execSync(['npx', 'playwright', 'install'].concat(args).join(' '), {
      stdio: 'inherit',
    });
  };
}
