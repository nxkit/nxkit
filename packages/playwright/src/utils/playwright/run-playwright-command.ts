import { execSync } from 'child_process';

export const enum PlayWrightCommand {
  TEST = 'test',
  SHOW_REPORT = 'show-report',
  CODEGEN = 'codegen',
  OPEN = 'open',
  INSTALL = 'install',
}

export function runPlaywrightCommand(
  playwrightCommand: PlayWrightCommand,
  args?: string[],
  cwd?: string
) {
  const command = ['npx', 'playwright', playwrightCommand]
    .concat(args)
    .join(' ');
  execSync(command, { stdio: 'inherit', cwd });
  return;
}
