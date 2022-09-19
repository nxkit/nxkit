import { getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import {
  NormalizedProjectGeneratorSchema,
  ProjectGeneratorSchema,
} from '../schema';

export function normalizeDirectory(options: ProjectGeneratorSchema) {
  const name = names(options.name).fileName;
  return options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
}

export function normalizeProjectName(options: ProjectGeneratorSchema) {
  return normalizeDirectory(options).replace(new RegExp('/', 'g'), '-');
}

function getE2EprojectName(options: ProjectGeneratorSchema) {
  const { name, frontendProject } = options;
  if (name) {
    return name.endsWith('-e2e') ? name : `${name}-e2e`;
  }

  if (frontendProject) {
    return `${frontendProject}-e2e`;
  }
  const defaultProjectName = 'playwright-tests-e2e';
  logger.warn(`Using deafult project name: ${defaultProjectName}`);
  return defaultProjectName;
}

function parseTags(tags: string): string[] {
  return tags ? tags.split(',').map((s) => s.trim()) : [];
}

export function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorSchema
): NormalizedProjectGeneratorSchema {
  options.name = getE2EprojectName(options);

  if (!options.frontendProject) {
    options.frontendProject = '';
  }

  const projectDirectory = normalizeDirectory(options);
  const projectName = normalizeProjectName(options);
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = parseTags(options.tags);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
