import { ExecutorContext } from '@nx/devkit';
import { Core } from 'style-dictionary';
import { NormalizedBuildExecutorSchema } from '../../schema';
import { registerCustomActions } from './extensions/register-custom-actions';
import { registerCustomFileHeaders } from './extensions/register-custom-file-headers';
import { registerCustomFilters } from './extensions/register-custom-filters';
import { registerCustomFormats } from './extensions/register-custom-formats';
import { registerCustomParsers } from './extensions/register-custom-parsers';
import { registerCustomTransformGroups } from './extensions/register-custom-transform-groups';
import { registerCustomTransforms } from './extensions/register-custom-transforms';

export function registerExtensions(
  styleDictionaryInstance: Core,
  options: NormalizedBuildExecutorSchema,
  context: ExecutorContext
) {
  const {
    customActions,
    customFileHeaders,
    customFilters,
    customFormats,
    customParsers,
    customTransformGroups,
    customTransforms,
  } = options;

  if (customActions) {
    registerCustomActions(styleDictionaryInstance, options, context);
  }

  if (customFileHeaders) {
    registerCustomFileHeaders(styleDictionaryInstance, options, context);
  }

  if (customFilters) {
    registerCustomFilters(styleDictionaryInstance, options, context);
  }

  if (customFormats) {
    registerCustomFormats(styleDictionaryInstance, options, context);
  }

  if (customParsers) {
    registerCustomParsers(styleDictionaryInstance, options, context);
  }

  if (customTransforms) {
    registerCustomTransforms(styleDictionaryInstance, options, context);
  }

  if (customTransformGroups) {
    registerCustomTransformGroups(styleDictionaryInstance, options, context);
  }
}
