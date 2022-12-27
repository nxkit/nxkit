import { generateFiles, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { InitGeneratorSchema } from '../schema';

export function addWokspaceFiles(tree: Tree, options: InitGeneratorSchema) {
  const templateOptions = {
    ...options,
    template: '',
  };
  if (!tree.exists('./playwright.config.base.ts')) {
    console.log('creating root files');
    generateFiles(tree, path.join(__dirname, '../files'), '.', templateOptions);
  }
}
