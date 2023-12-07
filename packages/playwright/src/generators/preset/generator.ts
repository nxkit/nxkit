import { names, Tree, runTasksInSerial } from '@nx/devkit';
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
