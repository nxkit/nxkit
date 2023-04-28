import { formatFiles, Tree } from '@nx/devkit';
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial';
import initGenerator from '../init/generator';
import { addLinter } from './lib/add-linter';
import { addProjectConfig } from './lib/add-project-config';
import { addProjectFiles } from './lib/add-project-files';
import { normalizeOptions } from './lib/normalize-options';
import { ProjectGeneratorSchema } from './schema';

export async function projectGenerator(
  tree: Tree,
  options: ProjectGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  const initTask = await initGenerator(tree, {
    skipFormat: true,
    skipPackageJson: false,
  });

  addProjectConfig(tree, normalizedOptions);
  addProjectFiles(tree, normalizedOptions);

  const lintTask = await addLinter(tree, normalizedOptions);

  if (!normalizedOptions.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, lintTask);
}

export default projectGenerator;
