import {
  formatFiles,
  GeneratorCallback,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
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
    const installPlaywrightTask = await installPlaywright({
      force: options.forcePlaywrightInstall,
    });
    tasks.push(installPlaywrightTask);
  }

  await jsInitGenerator(tree, {
    skipFormat: true,
  });

  updateGitIgnore(tree);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
