import { ExecutorContext } from '@nx/devkit';
import {
  Action,
  FileHeader,
  Formatter,
  Parser,
  Transform,
} from 'style-dictionary';
import { Matcher } from 'style-dictionary/types/Matcher';
import { NormalizedBuildExecutorSchema } from '../../schema';

export type ExtensionContext = {
  options: NormalizedBuildExecutorSchema;
  context: ExecutorContext;
};

type ExtensionBuilder<T> = (
  extensionContext: ExtensionContext
) => Record<string, T>;

export type CustomActionsBuilder = ExtensionBuilder<Action>;
export type CustomTransformsBuilder = ExtensionBuilder<Transform>;
export type CustomFormatsBuilder = ExtensionBuilder<Formatter>;
export type CustomTransformGroupsBuilder = ExtensionBuilder<string[]>;
export type CustomFileHeadersBuilder = ExtensionBuilder<FileHeader>;
export type CustomFiltersBuilder = ExtensionBuilder<Matcher>;
export type CustomParsersBuilder = (
  extensionContext: ExtensionContext
) => Parser[];
