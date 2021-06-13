import { reinterpret } from '@skintest/common';
import { ControlStep } from './command';
import { getCaller, getStepMeta } from './meta';
import { RepeatRead, RepeatYield } from './repeat';
import { TillStep } from './steps/till';

export interface Till {
  (message: string): ControlStep;
  yield: RepeatRead;
}

const repeatTill = (message: string): ControlStep => {
  const caller = getCaller();
  return new TillStep(() => getStepMeta(caller), message);
};

Object.defineProperty(repeatTill, 'yield', {
  get() {
    return new RepeatYield();
  },
  enumerable: false,
});

export const till: Till = reinterpret<Till>(repeatTill);