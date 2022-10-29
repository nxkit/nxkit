export const enum Extension {
  ACTIONS = 'actions',
  FILE_HEADERS = 'file-headers',
  FILTERS = 'filters',
  FORMATS = 'formats',
  PARSERS = 'parsers',
  TRANSFORM_GROUPS = 'transform-groups',
  TRANSFORMS = 'transforms',
}

export interface ExtensionGeneratorSchema {
  project: string;
  extensions: Extension[];
  directory: string;
}

interface NormalizedExtensionGeneratorSchema extends ExtensionGeneratorSchema {
  projectRoot: string;
}
