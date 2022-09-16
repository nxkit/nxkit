import {
  getArgsFromCLIOptions,
  PlaywrightCodegenCLIOptions,
  PlaywrightInstallCLIOptions,
  PlaywrightShowReportCLIOptions,
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

  static showReport(cliOptions: PlaywrightShowReportCLIOptions, cwd?: string) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.SHOW_REPORT, args, cwd);
  }

  static codegen(cliOptions: PlaywrightCodegenCLIOptions, cwd?: string) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.CODEGEN, args, cwd);
  }

  static open(cliOptions: PlaywrightCodegenCLIOptions, cwd?: string) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.OPEN, args, cwd);
  }

  static install(cliOptions: PlaywrightInstallCLIOptions, cwd?: string) {
    const args = getArgsFromCLIOptions(cliOptions);
    runPlaywrightCommand(PlayWrightCommand.INSTALL, args, cwd);
  }
}
