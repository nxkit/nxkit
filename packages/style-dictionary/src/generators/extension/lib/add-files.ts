import { generateFiles, names, offsetFromRoot, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../schema';

export function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.project),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, '../files'),
    options.directory,
    templateOptions
  );
}
