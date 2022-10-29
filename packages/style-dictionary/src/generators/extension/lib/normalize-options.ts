import {
  joinPathFragments,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { ExtensionGeneratorSchema, NormalizedSchema } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: ExtensionGeneratorSchema
): NormalizedSchema {
  const projectRoot = readProjectConfiguration(tree, options.project).root;

  const directory = joinPathFragments(
    projectRoot,
    options.directory ?? 'src/extensions'
  );

  return {
    ...options,
    projectRoot,
    directory,
  };
}
