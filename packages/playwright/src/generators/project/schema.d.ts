import { Linter } from '@nx/linter';

export interface ProjectGeneratorSchema {
  name?: string;
  frontendProject?: string;
  baseUrl?: string;
  tags?: string;
  directory?: string;
  linter?: Linter;
  skipFormat?: boolean;
}

export interface NormalizedProjectGeneratorSchema
  extends ProjectGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
