import { getPackageManagerCommand, detectPackageManager } from '@nx/devkit';
import { tmpProjPath } from '@nx/plugin/testing';
import { execSync } from 'child_process';

export function installPackage(
  pkg: string,
  version = 'latest',
  mode: 'dev' | 'prod' = 'dev'
) {
  const cwd = tmpProjPath();
  const pm = getPackageManagerCommand(detectPackageManager(cwd));
  const pkgsWithVersions = pkg
    .split(' ')
    .map((pgk) => `${pgk}@${version}`)
    .join(' ');
  const install = execSync(
    `${mode === 'dev' ? pm.addDev : pm.add} ${pkgsWithVersions}`,
    {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
      encoding: 'utf-8',
    }
  );
  return install ? install.toString() : '';
}
