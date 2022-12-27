import { PlaywrightTestCLIOptions } from '../../../utils/playwright';
import { TestExecutorSchema } from '../schema';

export function createCLIOptions(
  options: TestExecutorSchema
): PlaywrightTestCLIOptions {
  return {
    output: options.outputPath,
    config: options.playwrightConfig,
    browser: options.browser,
    debug: options.debug,
    forbidOnly: options.forbidOnly,
    globalTimeout: options.globalTimeout,
    grep: options.grep,
    grepInvert: options.grepInvert,
    headed: options.headed,
    list: options.list,
    maxFailures: options.maxFailures,
    project: options.project,
    quiet: options.quiet,
    repeatEach: options.repeatEach,
    reporter: options.reporter,
    retries: options.retries,
    shard: options.shard,
    timeout: options.timeout,
    updateSnapshots: options.updateSnapshots,
    workers: options.workers,
  };
}
