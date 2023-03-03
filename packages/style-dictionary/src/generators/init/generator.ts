import { formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { initGenerator as jsInitGenerator } from '@nrwl/js';
import { addDependencies } from './lib/add-dependencies';
import { InitGeneratorSchema } from './schema';

export async function initGenerator(tree: Tree, options: InitGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];

  await jsInitGenerator(tree, {
    skipFormat: true,
  });

  if (!options.skipPackageJson) {
    const installPackagesTask = addDependencies(tree);
    tasks.push(installPackagesTask);
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
