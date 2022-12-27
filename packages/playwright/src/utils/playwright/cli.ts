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
  static async test(
    cliOptions: PlaywrightTestCLIOptions,
    opts?: PlaywrightCommandOpts
  ) {
    const args = getArgsFromCLIOptions(cliOptions);
    return runPlaywrightCommand(PlayWrightCommand.TEST, args, opts);
  }

  static async showReport(reportPath: string, opts?: PlaywrightCommandOpts) {
    const args = [reportPath];
    return runPlaywrightCommand(PlayWrightCommand.SHOW_REPORT, args, opts);
  }

  static async install(
    cliOptions: PlaywrightInstallCLIOptions,
    opts?: PlaywrightCommandOpts
  ) {
    const args = getArgsFromCLIOptions(cliOptions);
    return runPlaywrightCommand(PlayWrightCommand.INSTALL, args, opts);
  }
}
