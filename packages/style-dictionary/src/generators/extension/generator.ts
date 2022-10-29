import { formatFiles, Tree } from '@nrwl/devkit';
import { addFiles } from './lib/add-files';
import { normalizeOptions } from './lib/normalize-options';
import { updateProjectConfig } from './lib/update-project-config';
import { ExtensionGeneratorSchema } from './schema';

export async function extensionGenerator(
  tree: Tree,
  options: ExtensionGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  updateProjectConfig(tree, normalizedOptions);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default extensionGenerator;
