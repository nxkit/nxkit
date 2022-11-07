import { ExecutorContext, logger } from '@nrwl/devkit';
import { PlaywrightCLI } from '../../utils/playwright';
import { createCLIOptions } from './lib/create-cli-options';
import { TestExecutorSchema } from './schema';

export default async function runExecutor(
  options: TestExecutorSchema,
  context: ExecutorContext
) {
  const cliOptions = createCLIOptions(options);
  PlaywrightCLI.test(cliOptions);

  logger.log(`Playwright tests ran for ${context.projectName} project`);
  return { success: true };
}
