import {
  extractLayoutDirectory,
  getWorkspaceLayout,
  joinPathFragments,
  logger,
  names,
  Tree,
} from '@nx/devkit';
import {
  NormalizedProjectGeneratorSchema,
  ProjectGeneratorSchema,
} from '../schema';

export function normalizeDirectory(projectName: string, directory: string) {
  const { projectDirectory } = extractLayoutDirectory(directory);
  const name = names(projectName).fileName;
  return projectDirectory
    ? `${names(projectDirectory).fileName}/${name}`
    : name;
}

export function normalizeProjectName(projectName: string, directory: string) {
  return normalizeDirectory(projectName, directory).replace(
    new RegExp('/', 'g'),
    '-'
  );
}

function getE2EprojectName(options: ProjectGeneratorSchema) {
  const { name, frontendProject } = options;

  if (name) {
    return name;
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

  const projectDirectory = normalizeDirectory(options.name, options.directory);
  const projectName = normalizeProjectName(options.name, options.directory);

  const { layoutDirectory } = extractLayoutDirectory(options.directory ?? '');
  const appsDir = layoutDirectory ?? getWorkspaceLayout(tree).appsDir;
  const projectRoot = joinPathFragments(appsDir, projectDirectory);

  const parsedTags = parseTags(options.tags);

  return {
    ...options,
    baseUrl: options.baseUrl,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
