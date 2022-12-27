export interface ProjectGeneratorSchema {
  name?: string;
  frontendProject?: string;
  baseUrl?: string;
  tags?: string;
  directory?: string;
  skipFormat?: boolean;
}

export interface NormalizedProjectGeneratorSchema
  extends ProjectGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
