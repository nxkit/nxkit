/* eslint-disable @typescript-eslint/no-var-requires */
import { BuildExecutorSchema } from './schema';
import executor from './executor';
import { ExecutorContext } from '@nrwl/devkit';
import { runBuild } from './lib/run-style-dictionary';

const options: BuildExecutorSchema = {
  styleDictionaryConfig: '',
  tsConfig: '',
  outputPath: '',
};

jest.mock('./lib/run-style-dictionary');
jest.mock('./lib/normalize-config');
describe('Build Executor', () => {
  it('can run', async () => {
    const mockContext: ExecutorContext = {
      root: '/root',
      workspace: {
        version: 2,
        projects: {
          'mock-project': {
            root: '/root/mock-project',
            sourceRoot: '/root/mock-project/src',
          },
        },
      },
      projectName: 'mock-project',
      cwd: '/root',
      isVerbose: false,
    };

    const cliUtils = require('nx/src/utils/command-line-utils');
    cliUtils.getProjectRoots = jest.fn().mockReturnValue('/root/mock-project');

    const output = await executor(options, mockContext);
    expect(runBuild).toBeCalled();
    expect(output.success).toBe(true);
  });
});
