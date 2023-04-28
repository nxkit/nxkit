import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  NX_VERSION,
  Tree,
} from '@nx/devkit';
import { styleDictionaryVersion } from '../../../utils/versions';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nx/js': NX_VERSION,
      'style-dictionary': styleDictionaryVersion,
    }
  );
}
