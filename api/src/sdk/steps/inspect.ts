import { Guard } from '../../common/guard';
import { invalidArgumentError } from '../../common/errors';
import { Query, QueryList } from '../query';
import { DevStep, StepContext } from '../command';
import { inspect, TestExecutionResult } from '../test-result';
import { isString } from '../../common/utils';

export class InspectStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(private query: string | Query<any> | QueryList<any>) {
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): TestExecutionResult {
    const { engine } = context;

    const query = this.query.toString();
    const type = isString(this.query) ? 'selectAll' : (this.query as any).type
    switch (type) {
      case 'select': {
        const target = await engine.select(query);
        return inspect({ selector: query, target });
      }

      case 'selectAll': {
        const target = await engine.selectAll(query);
        return inspect({ selector: query, target });
      }

      default: {
        throw invalidArgumentError('selector', type);
      }
    }
  }

  toString() {
    return 'I inspect';
  }
}
