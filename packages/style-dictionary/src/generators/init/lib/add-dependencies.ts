import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  NX_VERSION,
  Tree,
} from '@nrwl/devkit';
import { styleDictionaryVersion } from '../../../utils/versions';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/js': NX_VERSION,
      'style-dictionary': styleDictionaryVersion,
    }
  );
}
