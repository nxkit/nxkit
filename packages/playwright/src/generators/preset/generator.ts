import { names, Tree } from '@nx/devkit';
import { runTasksInSerial } from '@nx/workspace/src/utilities/run-tasks-in-serial';
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

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  const projectTask = await projectGenerator(tree, normalizedOptions);
  return runTasksInSerial(projectTask);
}

export default presetGenerator;
