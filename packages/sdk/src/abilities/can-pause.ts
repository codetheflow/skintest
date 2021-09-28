import { getCaller, getMeta } from '@skintest/common';
import { DevStep } from '../command';
import { PauseStep } from '../steps/pause-step';

export class CanPause {
  __pause<D>(): DevStep<D> {
    const caller = getCaller();
    return new PauseStep(() => getMeta(caller));
  }
}