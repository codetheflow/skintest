import { getCaller, getMeta } from '@skintest/common';
import { ControlStep } from './command';
import { IIfStep } from './steps/iif-step';

export function iif<D>(message: string): ControlStep<D> {
  const caller = getCaller();
  return new IIfStep(() => getMeta(caller), message);
}