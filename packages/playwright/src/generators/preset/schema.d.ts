import { Linter } from '@nx/eslint';
export interface PresetGeneratorSchema {
  name: string;
  baseUrl: string;
  linter?: Linter;
}
