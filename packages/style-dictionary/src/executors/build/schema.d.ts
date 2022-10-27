export interface BuildExecutorSchema {
  styleDictionaryConfig: string;
  tsConfig: string;
  outputPath: string;
  deleteOutputPath?: boolean;
  platform?: string;
}

export interface NormalizedBuildExecutorSchema extends BuildExecutorSchema {
  root?: string;
  sourceRoot?: string;
}
