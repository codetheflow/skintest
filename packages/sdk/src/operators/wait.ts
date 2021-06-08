import { getCaller, getStepMeta } from '../meta';
import { Query } from '../query';
import { RecipeIterable, RecipeOperator } from '../recipe';

export type ClientPageWaitEvents = {
  'download': (visit: { save(path: string): void }) => void,
  'file-chooser': (visit: { open(...paths: string[]): void }) => void,
  'navigation': string,
  'checked': Query,
  'disabled': Query,
  'focused': Query,
  'editable': Query,
  'enabled': Query,
  'hidden': Query,
  'unchecked': Query,
  'visible': Query,
  'exists': Query,
};

export function wait<E extends keyof ClientPageWaitEvents>(event: E, options: ClientPageWaitEvents[E]): RecipeOperator<RecipeIterable | undefined, RecipeIterable> {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  return source => [...(source || [])];
  // switch (event) {
  //   case 'checked':
  //   case 'disabled':
  //   case 'focused':
  //   case 'editable':
  //   case 'enabled':
  //   case 'hidden':
  //   case 'unchecked':
  //   case 'visible':
  //   case 'exists': {

  //   }
  //     break;
  // }

  // switch (event) {
  //   default: {
  //     throw errors.invalidArgument('event', event);
  //   }
  // }
}