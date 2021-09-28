import { getCaller, getMeta } from '@skintest/common';
import { CheckStep } from '../command';
import { VerifyStep } from '../steps/verify-step';
import { Value } from '../value';

export class CanCheck {
  check<D>(message: Value<string, D>): CheckStep<D> {
    const caller = getCaller();
    return new VerifyStep(() => getMeta(caller), message);
  }
}