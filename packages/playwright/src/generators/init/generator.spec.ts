import { readJson, Tree } from '@nx/devkit';
import { installPackagesTask } from '@nx/devkit/src/tasks/install-packages-task';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { PlaywrightCLI } from '../../utils/playwright';
import { initGenerator } from './generator';
import { InitGeneratorSchema } from './schema';

jest.mock('../../utils/playwright');
jest.mock('@nx/devkit/src/tasks/install-packages-task');

describe('init generator', () => {
  let appTree: Tree;
  const options: InitGeneratorSchema = { skipPackageJson: false };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    const generatorCallback = await initGenerator(appTree, options);
    await generatorCallback();

    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.devDependencies['@playwright/test']).toBeDefined();
    expect(installPackagesTask).toHaveBeenCalled();
    expect(PlaywrightCLI.install).toHaveBeenCalled();
  });
});
