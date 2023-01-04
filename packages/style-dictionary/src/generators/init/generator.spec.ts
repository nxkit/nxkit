import { readJson, Tree } from '@nrwl/devkit';
import { installPackagesTask } from '@nrwl/devkit/src/tasks/install-packages-task';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';
import { InitGeneratorSchema } from './schema';

jest.mock('@nrwl/devkit/src/tasks/install-packages-task');

describe('Style Dictionary Init', () => {
  let appTree: Tree;
  const options: InitGeneratorSchema = { skipPackageJson: false };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    const generatorCallback = await generator(appTree, options);
    await generatorCallback();

    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.devDependencies['style-dictionary']).toBeDefined();
    expect(installPackagesTask).toHaveBeenCalled();
  });
});
