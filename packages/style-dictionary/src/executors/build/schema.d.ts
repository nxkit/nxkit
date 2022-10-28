export interface BuildExecutorSchema {
  styleDictionaryConfig: string;
  tsConfig: string;
  customActions?: string;
  customFileHeaders?: string;
  customFilters?: string;
  customFormats?: string;
  customParsers?: string;
  customTransformGroups?: string;
  customTransforms?: string;
  outputPath: string;
  deleteOutputPath?: boolean;
  platform?: string;
}

export interface NormalizedBuildExecutorSchema extends BuildExecutorSchema {
  root?: string;
  sourceRoot?: string;
}
