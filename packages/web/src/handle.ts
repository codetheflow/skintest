import { TaskIterable, TaskOperator } from '@skintest/sdk';
import { Download } from './steps/wait-download-step';
import { FileDialog } from './steps/wait-file-dialog-step';

type ClientPageEvents = {
  'download': Download,
  'file-dialog': FileDialog,
  // 'navigation': void | string | RegExp;
  // 'state': 'load' | 'domcontentloaded' | 'networkiddle'
};

export function handle<E extends keyof ClientPageEvents>(event: E, options: ClientPageEvents[E]): TaskOperator<TaskIterable, TaskIterable> {
  return null as any;
  // const caller = getCaller();
  // const getStepMeta = () => getMeta(caller);

  // switch (event) {
  //   case 'download':
  //     return source => [
  //       new EventStep(
  //         getStepMeta,
  //         new Indexed([new WaitDownloadStep(getStepMeta, options as Download)]),
  //         new Indexed(Array.from(source)),
  //       )
  //     ];
  //   case 'file-dialog':
  //     return source => [
  //       new EventStep(
  //         getStepMeta,
  //         new Indexed([new WaitFileDialogStep(getStepMeta, options as FileDialog)]),
  //         new Indexed(Array.from(source)),
  //       )
  //     ];
  //   default: {
  //     throw errors.invalidArgument('event', event);
  //   }
  // }
}

// function download(visit: { save(path: string): void }): void {

// }