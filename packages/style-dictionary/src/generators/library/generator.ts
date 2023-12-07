import {
  formatFiles,
  joinPathFragments,
  Tree,
  runTasksInSerial,
} from '@nx/devkit';
import extensionGenerator from '../extension/generator';
import { Extension } from '../extension/schema';
import initGenerator from '../init/generator';
import { addLinter } from './lib/add-linter';
import { addProjectConfig } from './lib/add-project-config';
import { addProjectFiles } from './lib/add-project-files';
import { normalizeOptions } from './lib/normalize-options';
import { LibraryGeneratorSchema, Preset } from './schema';

export async function libraryGenerator(
  tree: Tree,
  options: LibraryGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  const initTask = await initGenerator(tree, {
    skipFormat: true,
    skipPackageJson: false,
  });

  addProjectConfig(tree, normalizedOptions);
  addProjectFiles(tree, normalizedOptions);

  if (normalizedOptions.preset === Preset.COMPLETE) {
    await extensionGenerator(tree, {
      project: normalizedOptions.projectName,
      extensions: [Extension.ACTIONS],
      directory: joinPathFragments('src', 'extensions'),
    });
  }

  const lintTask = await addLinter(tree, normalizedOptions);

  if (!normalizedOptions.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, lintTask);
}

export default libraryGenerator;
