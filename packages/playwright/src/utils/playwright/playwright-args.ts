import { normalizeArgValue } from '../args';

export interface PlaywrightTestCLIOptions {
  config?: string;
  output?: string;
  headed?: boolean;
  browser?: string;
  debug?: boolean;
  forbidOnly?: boolean;
  grep?: string;
  grepInvert?: string;
  globalTimeout?: number;
  list?: boolean;
  maxFailures?: number;
  project?: string;
  quiet?: boolean;
  repeatEach?: number;
  reporter?: string;
  retries?: number;
  shard?: string;
  timeout?: number;
  updateSnapshots?: boolean;
  workers?: number;
}

export interface PlaywrightShowReportCLIOptions {
  config?: string;
}

export interface PlaywrightCodegenCLIOptions {
  saveStorage?: string;
  loadStorage?: string;
}

export interface PlaywrightOpenCLIOptions {
  loadStorage?: string;
}

export interface PlaywrightInstallCLIOptions {
  withDeps?: boolean;
}

function toKebabCase(text: string) {
  return text.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

export function getArgsFromCLIOptions(
  cliOptions:
    | PlaywrightTestCLIOptions
    | PlaywrightShowReportCLIOptions
    | PlaywrightCodegenCLIOptions
    | PlaywrightOpenCLIOptions
    | PlaywrightInstallCLIOptions
): string[] {
  const args = Object.entries(cliOptions).reduce<string[]>(
    (args, [option, optionValue]) => {
      if (!optionValue) {
        return args;
      }

      const normalizedValue = normalizeArgValue(optionValue);
      const newArg = `--${toKebabCase(option)}${
        normalizedValue ? ` ${normalizedValue}` : ''
      }`;
      return [...args, newArg];
    },
    []
  );

  return args;
}
