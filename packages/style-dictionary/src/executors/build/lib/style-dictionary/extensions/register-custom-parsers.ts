import { ExecutorContext } from '@nrwl/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomParsersBuilder } from '../extensions.types';

export function registerCustomParsers(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customActions, tsConfig } = options;

  const builder = resolveFile(customActions, tsConfig) as CustomParsersBuilder;
  const parsers = builder({
    options,
    context,
  });
  parsers.forEach(styleDictionaryInstace.registerParser);
}
