import { Guard } from '../../common/guard';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class WaitUrlStep implements UIStep {
  type: 'ui' = 'ui';

  constructor(private url: string) {
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    return attempt(() => engine.waitForNavigation(this.url));
  }

  toString() {
    return `wait url ${this.url}`;
  }
}