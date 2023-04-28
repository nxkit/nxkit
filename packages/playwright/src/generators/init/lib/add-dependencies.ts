import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  NX_VERSION,
  Tree,
} from '@nx/devkit';
import { playwrightVersion } from '../../../utils/versions';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nx/js': NX_VERSION,
      '@playwright/test': playwrightVersion,
    }
  );
}
