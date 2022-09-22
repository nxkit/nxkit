import { TestExecutorSchema } from './schema';

import executor from './executor';
import {
  PlaywrightCLI,
  PlaywrightTestCLIOptions,
} from '../../utils/playwright';

jest.mock('../../utils/playwright');

const options: TestExecutorSchema = {
  playwrightConfig: 'mock-playqright.config.ts',
  outputPath: 'dist/apps/mock-project/test-results',
};

describe('Playwright Test Executor', () => {
  const mockContext = {
    root: '/root',
    workspace: { projects: {} },
    projectName: 'mock-project',
  } as any;

  it('can run', async () => {
    const output = await executor(options, mockContext);
    const expectedOptions: PlaywrightTestCLIOptions = {
      config: options.playwrightConfig,
      output: options.outputPath,
    };
    expect(PlaywrightCLI.test).toHaveBeenCalledWith(expectedOptions);
    expect(output.success).toBe(true);
  });
});
