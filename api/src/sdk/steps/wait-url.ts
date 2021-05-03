import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class WaitUrlStep implements ClientStep {
  type: 'client' = 'client';

  constructor(private url: string) {
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    return attempt(() => engine.waitForNavigation(this.url));
  }

  toString() {
    return `I wait url ${this.url}`;
  }
}