export const enum Extensions {
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
  extensions?: Extensions[];
  directory?: string;
}

interface NormalizedSchema extends ExtensionGeneratorSchema {
  projectRoot: string;
}
