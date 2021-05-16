import { invalidArgumentError } from '../../common/errors';
import { Guard } from '../../common/guard';
import { isString } from '../../common/utils';
import { DevStep, StepContext } from '../command';
import { Query, QueryList } from '../query';
import { inspect, TestExecutionResult } from '../test-result';

export class InspectStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(private query: string | Query<any> | QueryList<any>) {
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();

    // todo: get rid of `any`
    const type = isString(this.query) ? 'queryList' : (this.query as any).type
    switch (type) {
      case 'query': {
        const target = await page.query(selector);
        return inspect({ selector, target });
      }

      case 'queryList': {
        const target = await page.queryList(selector);
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
