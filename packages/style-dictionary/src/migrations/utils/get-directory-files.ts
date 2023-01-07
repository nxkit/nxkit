import { Tree, visitNotIgnoredFiles } from '@nrwl/devkit';

export function utilsWorkspace(): string {
  return 'utils-workspace';
}

export function getDirectoryFiles(
  tree: Tree,
  directoryPath: string,
  filesExtension?: string
): string[] {
  const files: string[] = [];

  visitNotIgnoredFiles(tree, directoryPath, (file) => {
    if (filesExtension && file.endsWith(filesExtension)) {
      files.push(file);
      return;
    }
    files.push(file);
  });
  return files;
}
