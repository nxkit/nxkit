import { ExecutorContext, logger } from '@nrwl/devkit';
import { deleteOutputDir } from '../../utils/fs/delete-output-path';
import { resolveFile } from '../../utils/typescript/resolve-file';
import { normalizeStyleDictionaryConfig } from './lib/normalize-config';
import { normalizeOptions } from './lib/normalize-options';
import { runBuild } from './lib/style-dictionary/run-build';
import { BuildExecutorSchema } from './schema';

export async function buildExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  const normalizedOptions = normalizeOptions(options, context);

  const { tsConfig, deleteOutputPath, outputPath } = normalizedOptions;
  const styleDictionaryConfig = resolveFile(
    normalizedOptions.styleDictionaryConfig,
    tsConfig
  );
  const normalizedConfig = normalizeStyleDictionaryConfig(
    styleDictionaryConfig,
    normalizedOptions,
    context
  );

  if (deleteOutputPath) {
    deleteOutputDir(context.root, outputPath);
  }

  try {
    runBuild(normalizedConfig, normalizedOptions, context);

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

export default buildExecutor;
