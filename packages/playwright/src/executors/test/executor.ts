import { ExecutorContext, logger } from '@nx/devkit';
import { PlaywrightCLI } from '../../utils/playwright';
import { createCLIOptions } from './lib/create-cli-options';
import { startDevServer } from './lib/start-dev-server';
import { TestExecutorSchema } from './schema';

export async function testExecutor(
  options: TestExecutorSchema,
  context: ExecutorContext
) {
  try {
    const cliOptions = createCLIOptions(options);
    const baseUrl = await startDevServer(options, context);

    await PlaywrightCLI.test(cliOptions, {
      cwd: context.root,
      env: baseUrl ? { E2E_BASE_URL: baseUrl } : {},
    });

    logger.log(`Playwright tests ran for ${context.projectName} project`);
    return { success: true };
  } catch (error) {
    // ¯\_(ツ)_/¯
    logger.error(error.stdout);
    logger.error(error.error);
    logger.error('❌ Error running playwright tests');
    return { success: false };
  }
}

export default testExecutor;
