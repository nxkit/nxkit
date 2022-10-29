import { Extension } from '../../generators/extension/schema';

export const extensionsOptionsMap: Record<Extension, string> = {
  [Extension.ACTIONS]: 'customActions',
  [Extension.FORMATS]: 'customFormats',
  [Extension.TRANSFORMS]: 'customTransforms',
  [Extension.TRANSFORM_GROUPS]: 'customTransformGroups',
  [Extension.PARSERS]: 'customParsers',
  [Extension.FILTERS]: 'customFilters',
  [Extension.FILE_HEADERS]: 'customFileHeaders',
};
