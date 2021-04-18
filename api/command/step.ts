import { Engine } from '../execution/engine';

export interface StepContext {
  engine: Engine;
  report(action: string, message?: string): void;
}

export interface Step {
  execute(context: StepContext): Promise<void>;
}
