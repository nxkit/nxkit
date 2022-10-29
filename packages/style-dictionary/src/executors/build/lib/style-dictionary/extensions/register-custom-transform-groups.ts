import { ExecutorContext } from '@nrwl/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomTransformGroupsBuilder } from '../extensions.types';

export function registerCustomTransformGroups(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customTransformGroups, tsConfig } = options;

  const builder = resolveFile(
    customTransformGroups,
    tsConfig
  ) as CustomTransformGroupsBuilder;
  const transformGroups = builder({
    options,
    context,
  });
  Object.entries(transformGroups).forEach(([name, transformGroup]) => {
    styleDictionaryInstace.registerTransformGroup({
      name,
      transforms: transformGroup,
    });
  });
}
