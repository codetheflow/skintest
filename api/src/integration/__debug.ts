import { Step } from './step';
import { Breakpoint, DebugStep } from './steps/debug';
import { PauseStep } from './steps/pause';

export function __skinbreak(breakpoint: Breakpoint): Step {
  return new DebugStep(breakpoint)
}

export function __skinpause(): Step {
  return new PauseStep();
}
