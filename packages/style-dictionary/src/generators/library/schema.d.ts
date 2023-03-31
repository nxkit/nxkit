import { Linter } from '@nrwl/linter';

export const enum Preset {
  BASIC = 'basic',
  COMPLETE = 'complete',
  MULTICONFIG = 'multiconfig',
}

export interface LibraryGeneratorSchema {
  name: string;
  preset: Preset;
  tags?: string;
  directory?: string;
  linter?: Linter;
  skipFormat?: boolean;
}

interface NormalizedLibraryGeneratorSchema extends LibraryGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
