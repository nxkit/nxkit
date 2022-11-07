import { PlaywrightTestCLIOptions } from '../../../utils/playwright';
import { TestExecutorSchema } from '../schema';

export function createCLIOptions(
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
