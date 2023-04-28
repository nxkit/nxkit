import { Linter } from '@nx/linter';
import { Preset } from '../library/schema';

export interface PresetGeneratorSchema {
  name: string;
  preset: Preset;
  linter?: Linter;
}
