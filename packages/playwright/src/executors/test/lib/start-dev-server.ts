import { ExecutorContext, parseTargetString, runExecutor } from '@nrwl/devkit';
import type { TestExecutorSchema } from '../schema';

export async function startDevServer(
  options: TestExecutorSchema,
  context: ExecutorContext
) {
  if (!options.devServerTarget || options.skipServe) {
    return options.baseUrl;
  }

  const devServerTarget = parseTargetString(options.devServerTarget);

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
  }>(devServerTarget, {}, context)) {
    if (!output.success) {
      throw new Error(
        `Could not start dev server for ${devServerTarget.project} project`
      );
    }
    return options.baseUrl || (output.baseUrl as string);
  }
}
