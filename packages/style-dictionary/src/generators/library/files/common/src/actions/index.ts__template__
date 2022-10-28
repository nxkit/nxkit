import { ExecutorContext } from '@nrwl/devkit';
import { BuildExecutorSchema } from '@nxkit/style-dictionary';
import { Action, Dictionary, Platform } from 'style-dictionary';
import { copyFilesAction } from './copy_files_action';

function customActions(
  options: BuildExecutorSchema,
  context: ExecutorContext
): Record<string, Action> {
  return {
    copy_files: copyFilesAction(options, context),
    my_custom_action: {
      /** The action in the form of a function. */
      do: (dictionary: Dictionary, config: Platform) => {
        console.log('do my_custom_action');
      },

      /** A function that undoes the action. */
      undo: (dictionary: Dictionary, config: Platform) => {
        console.log('undo my_custom_action');
      },
    },
  };
}

export default customActions;
