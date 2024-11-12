import { TestExecutorSchema } from './schema';

import executor from './executor';
import { PlaywrightCLI } from '../../utils/playwright';
import { ExecutorContext } from '@nx/devkit';

jest.mock('../../utils/playwright');

const options: TestExecutorSchema = {
  playwrightConfig: 'mock-playqright.config.ts',
  outputPath: 'dist/apps/mock-project/test-results',
};

describe('Playwright Test Executor', () => {
  const mockContext: ExecutorContext = {
    root: '/root',
    projectName: 'mock-project',
    projectsConfigurations: {
      version: 2,
      projects: {
        'mock-project': {
          root: 'apps/mock-project',
        },
      },
    },
    nxJsonConfiguration: {},
    cwd: process.cwd(),
    isVerbose: false,
    projectGraph: {
      version: '2',
      nodes: {
        'mock-project': {
          type: 'e2e',
          name: 'mock-project',
          data: {
            root: 'apps/mock-project',
            targets: {
              e2e: {
                configurations: {
                  development: {},
                },
              },
            },
          },
        },
      },
      dependencies: {},
    },
  };

  it('can run', async () => {
    const output = await executor(options, mockContext);
    expect(PlaywrightCLI.test).toHaveBeenCalled();
    expect(output.success).toBe(true);
  });
});
