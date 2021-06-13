import { ControlStep } from './command';
import { getCaller, getStepMeta } from './meta';
import { IIfStep } from './steps/iif';

export function iif(message: string): ControlStep {
  const caller = getCaller();
  return new IIfStep(() => getStepMeta(caller), message);
}