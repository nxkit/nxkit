import { ExecutorContext } from '@nrwl/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomFormatsBuilder } from '../extensions.types';

export function registerCustomFormats(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customActions, tsConfig } = options;

  const builder = resolveFile(customActions, tsConfig) as CustomFormatsBuilder;
  const formats = builder({
    options,
    context,
  });
  Object.entries(formats).forEach(([name, formatter]) => {
    styleDictionaryInstace.registerFormat({
      name,
      formatter,
    });
  });
}
