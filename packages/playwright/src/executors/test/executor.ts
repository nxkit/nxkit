import { TestExecutorSchema } from './schema';
import {
  PlaywrightCLI,
  PlaywrightTestCLIOptions,
} from '../../utils/playwright';
import { ExecutorContext, logger } from '@nrwl/devkit';

function createCLIOptions(
  options: TestExecutorSchema
): PlaywrightTestCLIOptions {
  const { outputPath, playwrightConfig } = options;
  const cliOptions = {
    ...options,
    output: outputPath,
    config: playwrightConfig,
  };
  delete cliOptions.playwrightConfig;
  delete cliOptions.outputPath;

  return cliOptions;
}

export default async function runExecutor(
  options: TestExecutorSchema,
  context: ExecutorContext
) {
  const cliOptions = createCLIOptions(options);
  PlaywrightCLI.test(cliOptions);
  logger.log(`Playwright tests ran for ${context.projectName} project`);
  return { success: true };
}
