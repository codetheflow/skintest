import { getCaller, getMeta } from '@skintest/common';
import { InfoStep } from '../command';
import { SayStep } from '../steps/say-step';
import { Value } from '../value';

export class CanSay {
  say<D>(message: Value<string, D>): InfoStep<D> {
    const caller = getCaller();
    return new SayStep(() => getMeta(caller), message);
  }
}