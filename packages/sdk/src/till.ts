import { getCaller, getMeta, reinterpret } from '@skintest/common';
import { ControlStep } from './command';
import { RepeatRead, RepeatYield } from './repeat';
import { TillStep } from './steps/till';

export interface Till {
  <D>(message: string): ControlStep<D>;
  item: RepeatRead;
}

function repeatTill<D>(message: string): ControlStep<D> {
  const caller = getCaller();
  return new TillStep(() => getMeta(caller), message);
}

Object.defineProperty(repeatTill, 'item', {
  get() {
    return new RepeatYield();
  },
  enumerable: false,
});

export const till: Till = reinterpret<Till>(repeatTill);