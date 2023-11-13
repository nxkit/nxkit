import {
  formatFiles,
  GeneratorCallback,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { addDependencies } from './lib/add-dependencies';
import { InitGeneratorSchema } from './schema';

export async function initGenerator(tree: Tree, options: InitGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  if (!options.skipPackageJson) {
    const installPackagesTask = addDependencies(tree);
    tasks.push(installPackagesTask);
  }

  await jsInitGenerator(tree, {
    skipFormat: true,
  });

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
