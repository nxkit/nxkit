import {
  extractLayoutDirectory,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  Tree,
} from '@nx/devkit';
import {
  LibraryGeneratorSchema,
  NormalizedLibraryGeneratorSchema,
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

export function normalizeOptions(
  tree: Tree,
  options: LibraryGeneratorSchema
): NormalizedLibraryGeneratorSchema {
  const projectDirectory = normalizeDirectory(options.name, options.directory);
  const projectName = normalizeProjectName(options.name, options.directory);

  const { layoutDirectory } = extractLayoutDirectory(options.directory ?? '');
  const libsDir = layoutDirectory ?? getWorkspaceLayout(tree).libsDir;
  const projectRoot = joinPathFragments(libsDir, projectDirectory);

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
