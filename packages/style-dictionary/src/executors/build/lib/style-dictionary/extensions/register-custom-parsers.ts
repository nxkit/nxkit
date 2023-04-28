import { ExecutorContext } from '@nx/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomParsersBuilder } from '../extensions.types';

export function registerCustomParsers(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customParsers, tsConfig } = options;

  const builder = resolveFile(customParsers, tsConfig) as CustomParsersBuilder;
  const parsers = builder({
    options,
    context,
  });

  parsers.forEach((parser) => styleDictionaryInstace.registerParser(parser));
}
