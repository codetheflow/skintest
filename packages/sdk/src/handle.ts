import { errors, getCaller, getMeta } from '@skintest/common';
import { RecipeIterable, RecipeOperator } from './recipe';
import { EventStep } from './steps/event';
import { Download, WaitDownloadStep } from './steps/wait-download';
import { FileDialog, WaitFileDialogStep } from './steps/wait-file-dialog';

export type ClientPageEvents = {
  'download': Download,
  'file-dialog': FileDialog,
  // 'navigation': void | string | RegExp;
  // 'state': 'load' | 'domcontentloaded' | 'networkiddle'
};

export function handle<E extends keyof ClientPageEvents>(event: E, options: ClientPageEvents[E]): RecipeOperator<RecipeIterable, RecipeIterable> {
  const caller = getCaller();
  const getStepMeta = () => getMeta(caller);

  switch (event) {
    case 'download':
      return source => [
        new EventStep(
          getStepMeta,
          new WaitDownloadStep(getStepMeta, options as Download),
          Array.from(source),
        )
      ];
    case 'file-dialog':
      return source => [
        new EventStep(
          getStepMeta,
          new WaitFileDialogStep(getStepMeta, options as FileDialog),
          Array.from(source),
        )
      ];
      break;
    default: {
      throw errors.invalidArgument('event', event);
    }
  }
}

// function download(visit: { save(path: string): void }): void {

// }