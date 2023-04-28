import { Linter } from '@nx/linter';
export interface PresetGeneratorSchema {
  name: string;
  baseUrl: string;
  linter?: Linter;
}
