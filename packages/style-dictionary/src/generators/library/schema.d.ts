export enum Preset {
  BASIC = 'basic',
  COMPLETE = 'complete',
}

export interface LibraryGeneratorSchema {
  name: string;
  preset?: Preset;
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
