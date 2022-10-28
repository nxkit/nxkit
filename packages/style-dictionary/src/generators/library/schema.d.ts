export enum Preset {
  BASIC = 'basic',
  COMPLETE = 'complete',
}

export enum Extensions {
  ACTIONS = 'actions',
  FILE_HEADERS = 'file-headers',
  FILTERS = 'filters',
  FORMATS = 'formats',
  PARSERS = 'parsers',
  TRANSFORM_GROUPS = 'transform-groups',
  TRANSFORMS = 'transforms',
}

export interface LibraryGeneratorSchema {
  name: string;
  preset?: Preset;
  extensions?: Extensions[];
  tags?: string;
  directory?: string;
  skipFormat?: boolean;
}

interface NormalizedLibraryGeneratorSchema extends LibraryGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
