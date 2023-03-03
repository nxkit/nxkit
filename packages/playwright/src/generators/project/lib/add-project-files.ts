import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { getRelativePathToRootTsConfig } from '@nrwl/js';
import * as path from 'path';
import { NormalizedProjectGeneratorSchema } from '../schema';

export function addProjectFiles(
  tree: Tree,
  options: NormalizedProjectGeneratorSchema
) {
  const { projectRoot } = options;
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(projectRoot),
    rootTsConfigPath: getRelativePathToRootTsConfig(tree, projectRoot),
    outputPath: joinPathFragments('dist', projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, '../files'),
    options.projectRoot,
    templateOptions
  );
}
