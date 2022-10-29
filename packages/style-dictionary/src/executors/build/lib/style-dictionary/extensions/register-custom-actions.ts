import { ExecutorContext } from '@nrwl/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomActionsBuilder } from '../extensions.types';

export function registerCustomActions(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customActions, tsConfig } = options;

  const builder = resolveFile(customActions, tsConfig) as CustomActionsBuilder;
  const actions = builder({
    options,
    context,
  });
  Object.entries(actions).forEach(([name, action]) => {
    styleDictionaryInstace.registerAction({
      ...action,
      name,
    });
  });
}
