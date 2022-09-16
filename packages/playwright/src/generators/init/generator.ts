import { formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addDependencies } from './lib/add-dependencies';
import { installPlaywright } from './lib/install-playwright';
import { updateGitIgnore } from './lib/update-gitignore';
import { InitGeneratorSchema } from './schema';

export async function initGenerator(tree: Tree, options: InitGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  if (!options.skipPackageJson) {
    const installPackagesTask = addDependencies(tree);
    tasks.push(installPackagesTask);
  }

  if (!options.skipPlaywrightInstall) {
    const installPlaywrightTask = installPlaywright();
    tasks.push(installPlaywrightTask);
  }

  updateGitIgnore(tree);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
