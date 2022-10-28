import { ExecutorContext } from '@nrwl/devkit';
import { Core } from 'style-dictionary';
import { resolveFile } from '../../../../../utils/typescript/resolve-file';
import { NormalizedBuildExecutorSchema } from '../../../schema';
import { CustomTransformsBuilder } from '../extensions.types';

export function registerCustomTransforms(
  styleDictionaryInstace: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const { customTransforms, tsConfig } = options;

  const builder = resolveFile(
    customTransforms,
    tsConfig
  ) as CustomTransformsBuilder;
  const transforms = builder({
    options,
    context,
  });
  Object.entries(transforms).forEach(([name, transform]) => {
    styleDictionaryInstace.registerTransform({
      ...transform,
      name,
    });
  });
}
