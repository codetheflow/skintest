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
    const { page } = context;

    const selector = this.query.toString();

    // todo: get rid of `any`
    const type = isString(this.query) ? 'queryList' : (this.query as any).type
    switch (type) {
      case 'query': {
        const target = await page.query(selector);
        return inspect({ selector, target });
      }

      case 'queryList': {
        const target = await page.queryAll(selector);
        return inspect({ selector, target });
      }

      default: {
        throw invalidArgumentError('type', type);
      }
    }
  }

  toString() {
    return 'I inspect';
  }
}
