import { Linter } from '@nrwl/linter';
export interface PresetGeneratorSchema {
  name: string;
  baseUrl: string;
  linter?: Linter;
}
