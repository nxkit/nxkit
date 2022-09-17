import {
  getArgsFromCLIOptions,
  PlaywrightInstallCLIOptions,
  PlaywrightTestCLIOptions,
} from './playwright-args';
import {
  PlayWrightCommand,
  runPlaywrightCommand,
} from './run-playwright-command';

export class PlaywrightCLI {
  static test(cliOptions: PlaywrightTestCLIOptions, cwd?: string) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.TEST, args, cwd);
  }

  static showReport(reportPath: string, cwd?: string) {
    const args = [reportPath];
    runPlaywrightCommand(PlayWrightCommand.SHOW_REPORT, args, cwd);
  }

  static install(cliOptions: PlaywrightInstallCLIOptions, cwd?: string) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.INSTALL, args, cwd);
  }
}
