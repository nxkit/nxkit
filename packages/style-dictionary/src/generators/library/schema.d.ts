export interface LibraryGeneratorSchema {
    name: string;
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