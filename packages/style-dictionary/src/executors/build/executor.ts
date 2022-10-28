import { ExecutorContext, logger } from '@nrwl/devkit';
import { deleteOutputDir } from '../../utils/fs/delete-output-path';
import { resolveFile } from '../../utils/typescript/resolve-file';
import { normalizeStyleDictionaryConfig } from './lib/normalize-config';
import { normalizeOptions } from './lib/normalize-options';
import { runBuild } from './lib/style-dictionary/run-build';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const metadata = context.workspace.projects[context.projectName];
  const sourceRoot = metadata.sourceRoot;
  const normalizedOptions = normalizeOptions(options, context.root, sourceRoot);

  const { tsConfig } = normalizedOptions;
  const styleDictionaryConfig = resolveFile(
    options.styleDictionaryConfig,
    tsConfig
  );
  const normalizedConfig = normalizeStyleDictionaryConfig(
    styleDictionaryConfig,
    normalizedOptions,
    context
  );

  if (options.deleteOutputPath) {
    deleteOutputDir(context.root, options.outputPath);
  }

  try {
    runBuild(normalizedConfig, options, context);

    logger.log('✅ Successfully built design tokens');
    return {
      success: true,
    };
  } catch (error) {
    logger.error('❌ Error building design tokens');
    logger.error(error);
    return {
      success: false,
    };
  }
}
