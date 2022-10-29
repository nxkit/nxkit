import {
  updateProjectConfiguration,
  readProjectConfiguration,
  Tree,
  joinPathFragments,
} from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

export function updateProjectConfig(tree: Tree, options: NormalizedSchema) {
  const config = readProjectConfiguration(tree, options.project);

  config.targets.build.options.customActions = joinPathFragments(
    options.directory,
    'actions',
    'index.ts'
  );

  updateProjectConfiguration(tree, options.project, config);
}
