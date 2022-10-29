import { ExecutorContext } from '@nrwl/devkit';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { Core } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomActionsBuilder } from '../extensions.types';
import { resolve } from 'path';

export function registerCustomActions(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customActions, tsConfig } = options;

  const builder = resolveFile(
    resolve(options.root, customActions),
    tsConfig
  ) as CustomActionsBuilder;
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
