import { errors } from '@skintest/common';
import { getCaller, getStepMeta } from '../meta';
import { Query } from '../query';
import { RecipeOperator } from '../recipe';

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

export function wait<E extends keyof ClientPageWaitEvents>(event: E, options: ClientPageWaitEvents[E]): RecipeOperator {
  const caller = getCaller();
  const getMeta = () => getStepMeta(caller);

  switch (event) {
    default: {
      throw errors.invalidArgument('event', event);
    }
  }
}