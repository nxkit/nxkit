import { TestExecutorSchema } from './schema';
import {
  PlaywrightCLI,
  PlaywrightTestCLIOptions,
} from '../../utils/playwright';

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

export default async function runExecutor(options: TestExecutorSchema) {
  const cliOptions = createCLIOptions(options);
  PlaywrightCLI.test(cliOptions);
  console.log('Executor ran for Test', options);
  return { success: true };
}
