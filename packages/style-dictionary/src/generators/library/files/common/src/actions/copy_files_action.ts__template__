import { ExecutorContext } from '@nrwl/devkit';
import { BuildExecutorSchema } from '@nxkit/style-dictionary';
import { Action, Dictionary, Platform } from 'style-dictionary';

export function copyFilesAction(
  options: BuildExecutorSchema,
  context: ExecutorContext
): Action {
  return {
    /** The action in the form of a function. */
    do: (dictionary: Dictionary, config: Platform) => {
      console.log('do copy_files');
    },

    /** A function that undoes the action. */
    undo: (dictionary: Dictionary, config: Platform) => {
      console.log('undo copy_files');
    },
  };
}
