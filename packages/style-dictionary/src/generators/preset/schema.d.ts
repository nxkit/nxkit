import { Linter } from '@nx/eslint';
import { Preset } from '../library/schema';

export interface PresetGeneratorSchema {
  name: string;
  preset: Preset;
  linter?: Linter;
}
