import { getCaller, getMeta, Optional } from '@skintest/common';
import { PerformSchema } from './schema';
import { PerformStep } from './steps/perform-step';
import { TaskIterable, TaskOperator } from './task';

export function perform<D>(message: string, ...step: PerformSchema<D>): TaskOperator<Optional<TaskIterable>, TaskIterable> {
  const caller = getCaller();
  const getStepMeta = () => getMeta(caller);

  return source => [...(source || []), new PerformStep(getStepMeta, message, step)];
}