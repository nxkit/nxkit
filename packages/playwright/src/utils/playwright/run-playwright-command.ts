import { getPackageManagerCommand } from '@nrwl/devkit';
import { exec } from 'child_process';

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

export async function runPlaywrightCommand(
  playwrightCommand: PlayWrightCommand,
  args?: string[],
  opts: PlaywrightCommandOpts = { cwd: undefined, env: undefined }
): Promise<{ stdout: string; stderr: string }> {
  const pmc = getPackageManagerCommand();
  const command = [pmc.exec, 'playwright', playwrightCommand]
    .concat(args)
    .join(' ');

  const { cwd, env } = opts;

  return new Promise((resolve, reject) => {
    console.log('running command: ', command);
    exec(
      command,
      {
        cwd,
        env: { ...process.env, ...(env ?? {}) },
      },
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stdout, stderr });
        }
        resolve({ stdout, stderr });
      }
    ).stdout.pipe(process.stdout);
  });
}
