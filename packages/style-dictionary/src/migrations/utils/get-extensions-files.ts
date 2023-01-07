import { getProjects, Tree } from '@nrwl/devkit';
import { getDirectoryFiles } from './get-directory-files';
import { dirname } from 'path';
import { BuildExecutorSchema } from '../../executors/build/schema';

export function getExtensionsFiles(tree: Tree): string[] {
  const extensionsFiles = [];

  const projects = getProjects(tree);
  projects.forEach((config) => {
    if (config.targets?.build?.executor !== '@nxkit/style-dictionary:build') {
      return;
    }

    const buildOptions = config.targets.build.options as BuildExecutorSchema;
    const {
      customActions,
      customFileHeaders,
      customFilters,
      customFormats,
      customParsers,
      customTransformGroups,
      customTransforms,
    } = buildOptions;

    if (customActions && typeof customActions === 'string') {
      const actionsDir = dirname(customActions);
      extensionsFiles.push(...getDirectoryFiles(tree, actionsDir, '.ts'));
    }

    if (customFileHeaders && typeof customFileHeaders === 'string') {
      const fileHeadersDir = dirname(customFileHeaders);
      extensionsFiles.push(...getDirectoryFiles(tree, fileHeadersDir, '.ts'));
    }

    if (customFilters && typeof customFilters === 'string') {
      const filtersDir = dirname(customFilters);
      extensionsFiles.push(...getDirectoryFiles(tree, filtersDir, '.ts'));
    }

    if (customFormats && typeof customFormats === 'string') {
      const formatsDir = dirname(customFormats);
      extensionsFiles.push(...getDirectoryFiles(tree, formatsDir, '.ts'));
    }

    if (customParsers && typeof customParsers === 'string') {
      const parsersDir = dirname(customParsers);
      extensionsFiles.push(...getDirectoryFiles(tree, parsersDir, '.ts'));
    }

    if (customTransformGroups && typeof customTransformGroups === 'string') {
      const transformGroupsDir = dirname(customTransformGroups);
      extensionsFiles.push(
        ...getDirectoryFiles(tree, transformGroupsDir, '.ts')
      );
    }

    if (customTransforms && typeof customTransforms === 'string') {
      const transformsDir = dirname(customTransforms);
      extensionsFiles.push(...getDirectoryFiles(tree, transformsDir, '.ts'));
    }
  });

  return extensionsFiles;
}
