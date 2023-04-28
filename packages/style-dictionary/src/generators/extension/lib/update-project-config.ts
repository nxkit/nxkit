import {
  joinPathFragments,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { extensionsOptionsMap } from '../../../utils/extensions/options-map';
import { NormalizedExtensionGeneratorSchema } from '../schema';

function addExtensionsBuildOptions(
  config: ProjectConfiguration,
  options: NormalizedExtensionGeneratorSchema
) {
  options.extensions.forEach((extension) => {
    config.targets.build.options[extensionsOptionsMap[extension]] =
      joinPathFragments(options.directory, extension, 'index.ts');
  });
}

export function updateProjectConfig(
  tree: Tree,
  options: NormalizedExtensionGeneratorSchema
) {
  const config = readProjectConfiguration(tree, options.project);

  addExtensionsBuildOptions(config, options);
  updateProjectConfiguration(tree, options.project, config);
}
