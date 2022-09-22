import {
  getArgsFromCLIOptions,
  PlaywrightInstallCLIOptions,
  PlaywrightTestCLIOptions,
} from './playwright-args';
import {
  PlayWrightCommand,
  PlaywrightCommandOpts,
  runPlaywrightCommand,
} from './run-playwright-command';

export class PlaywrightCLI {
  static test(
    cliOptions: PlaywrightTestCLIOptions,
    opts?: PlaywrightCommandOpts
  ) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.TEST, args, opts);
  }

  static showReport(reportPath: string, opts?: PlaywrightCommandOpts) {
    const args = [reportPath];
    runPlaywrightCommand(PlayWrightCommand.SHOW_REPORT, args, opts);
  }

  static install(
    cliOptions: PlaywrightInstallCLIOptions,
    opts?: PlaywrightCommandOpts
  ) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.INSTALL, args, opts);
  }
}
