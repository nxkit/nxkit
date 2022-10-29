import { addProjectConfiguration, names, Tree } from '@nrwl/devkit';
import libraryGenerator from '../../generators/library/generator';
import { Preset } from '../../generators/library/schema';

export async function createLib(tree: Tree, appName: string): Promise<void> {
  await libraryGenerator(tree, {
    name: appName,
    preset: Preset.BASIC,
    skipFormat: true,
  });
}
