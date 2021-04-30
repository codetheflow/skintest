import { Guard } from '../../common/guard';
import { invalidArgumentError } from '../../common/errors';
import { Select, SelectAll } from '../selector';
import { Step, StepContext } from '../step';
import { inspect, TestExecutionResult } from '../test-result';
import { isString } from '../../common/check';

export class InspectStep implements Step {
  constructor(
    private selector: string | Select<any> | SelectAll<any>
  ) {
    Guard.notNull(selector, 'selector');
  }

  async execute(context: StepContext): TestExecutionResult {
    const { engine } = context;

    const query = this.selector.toString();
    const type = isString(this.selector) ? 'selectAll' : (this.selector as any).type
    switch (type) {
      case 'select': {
        const target = await engine.select(query);
        return inspect({ query, target });
      }

      case 'selectAll': {
        const target = await engine.selectAll(query);
        return inspect({ query, target });
      }

      default: {
        throw invalidArgumentError('selector', type);
      }
    }
  }

  toString() {
    return 'inspect';
  }
}
