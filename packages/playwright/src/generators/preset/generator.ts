import { names, Tree } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import projectGenerator from '../project/generator';
import { PresetGeneratorSchema } from './schema';

function normalizeOptions(
  tree: Tree,
  options: PresetGeneratorSchema
): PresetGeneratorSchema {
  const name = names(options.name).fileName;
  return {
    ...options,
    name,
  };
}

export default async function (tree: Tree, options: PresetGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const projectTask = await projectGenerator(tree, normalizedOptions);
  return runTasksInSerial(projectTask);
}
