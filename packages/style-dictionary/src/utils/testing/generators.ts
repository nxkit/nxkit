import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import libraryGenerator from '../../generators/library/generator';
import { Preset } from '../../generators/library/schema';

export async function createTestTokensLib(
  libName: string,
  opts = {} as { appsLibsLayout?: boolean }
): Promise<Tree> {
  const appTree = createTreeWithEmptyWorkspace(
    opts.appsLibsLayout ? { layout: 'apps-libs' } : undefined
  );
  await libraryGenerator(appTree, {
    name: libName,
    preset: Preset.BASIC,
  });

  return appTree;
}
