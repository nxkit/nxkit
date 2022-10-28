import { ExecutorContext } from '@nrwl/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomFileHeadersBuilder } from '../extensions.types';

export function registerCustomFileHeaders(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customFileHeaders, tsConfig } = options;

  const builder = resolveFile(
    customFileHeaders,
    tsConfig
  ) as CustomFileHeadersBuilder;
  const fileHeaders = builder({
    options,
    context,
  });
  Object.entries(fileHeaders).forEach(([name, fileHeader]) => {
    styleDictionaryInstace.registerFileHeader({
      name,
      fileHeader,
    });
  });
}
