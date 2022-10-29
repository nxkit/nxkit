import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedExtensionGeneratorSchema } from '../schema';

export function addFiles(
  tree: Tree,
  options: NormalizedExtensionGeneratorSchema
) {
  const templateOptions = {
    ...options,
    ...names(options.project),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  const { extensions } = options;
  extensions.forEach((extension) => {
    generateFiles(
      tree,
      path.join(__dirname, `../files/${extension}`),
      joinPathFragments(options.directory, extension),
      templateOptions
    );
  });
}
