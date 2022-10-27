import { ExecutorContext } from '@nrwl/devkit';
import { resolveStyleDictionaryConfig } from '../../utils/style-dictionary/get-config';
import { normalizeStyleDictionaryConfig } from './lib/normalize-config';
import { normalizeOptions } from './lib/normalize-options';
import { runBuild } from './lib/run-style-dictionary';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const metadata = context.workspace.projects[context.projectName];
  const sourceRoot = metadata.sourceRoot;
  const normalizedOptions = normalizeOptions(options, context.root, sourceRoot);

  const { tsConfig } = normalizedOptions;
  const styleDictionaryConfig = resolveStyleDictionaryConfig(
    options.styleDictionaryConfig,
    tsConfig
  );
  const normalizedConfig = normalizeStyleDictionaryConfig(
    styleDictionaryConfig,
    normalizedOptions,
    context
  );
  runBuild(normalizedConfig);
  console.log('Config is:', normalizedConfig);
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
