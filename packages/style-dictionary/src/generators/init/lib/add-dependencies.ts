import {
    addDependenciesToPackageJson,
    GeneratorCallback,
    Tree,
  } from '@nrwl/devkit';
  import { styleDictionaryVersion } from '../../../utils/versions';
  
  export function addDependencies(tree: Tree): GeneratorCallback {
    return addDependenciesToPackageJson(
      tree,
      {},
      {
        'style-dictionary': styleDictionaryVersion,
      }
    );
  }
  