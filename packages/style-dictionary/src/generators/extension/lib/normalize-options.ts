import {
  joinPathFragments,
  logger,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { extensionsOptionsMap } from '../../../utils/extensions/options-map';
import {
  Extension,
  ExtensionGeneratorSchema,
  NormalizedExtensionGeneratorSchema,
} from '../schema';

function normalizeExtensions(
  extensions: Extension[],
  projectConfig: ProjectConfiguration
): Extension[] {
  const normalized = [...new Set(extensions)].filter((extension) => {
    const canGenerate =
      !projectConfig.targets.build.options[extensionsOptionsMap[extension]];
    if (!canGenerate) {
      logger.warn(
        `Skipping ${extension}: ${extensionsOptionsMap[extension]} already exists in build options`
      );
    }
    return canGenerate;
  });
  logger.info('');

  return normalized;
}

export function normalizeOptions(
  tree: Tree,
  options: ExtensionGeneratorSchema
): NormalizedExtensionGeneratorSchema {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const projectRoot = projectConfig.root;

  const directory = joinPathFragments(projectRoot, options.directory);

  return {
    ...options,
    extensions: normalizeExtensions(options.extensions, projectConfig),
    projectRoot,
    directory,
  };
}
