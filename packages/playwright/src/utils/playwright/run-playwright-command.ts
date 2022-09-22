import { execSync } from 'child_process';

export const enum PlayWrightCommand {
  TEST = 'test',
  SHOW_REPORT = 'show-report',
  CODEGEN = 'codegen',
  OPEN = 'open',
  INSTALL = 'install',
}

export interface PlaywrightCommandOpts {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export function runPlaywrightCommand(
  playwrightCommand: PlayWrightCommand,
  args?: string[],
  opts: PlaywrightCommandOpts = { cwd: undefined, env: undefined }
) {
  const command = ['npx', 'playwright', playwrightCommand]
    .concat(args)
    .join(' ');

  const { cwd, env } = opts;
  execSync(command, {
    stdio: 'inherit',
    cwd: cwd ?? undefined,
    env: { ...process.env, ...(env ?? {}) },
  });
  return;
}
