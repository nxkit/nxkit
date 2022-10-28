import { ExecutorContext } from '@nrwl/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomFiltersBuilder } from '../extensions.types';

export function registerCustomFilters(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customActions, tsConfig } = options;

  const builder = resolveFile(customActions, tsConfig) as CustomFiltersBuilder;
  const filters = builder({
    options,
    context,
  });
  Object.entries(filters).forEach(([name, matcher]) => {
    styleDictionaryInstace.registerFilter({
      name,
      matcher,
    });
  });
}
