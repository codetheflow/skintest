import { errors, Guard, isString, reinterpret } from '@skintest/common';
import { DevStep, StepContext } from '../command';
import { StepMeta } from '../meta';
import { Query, QueryList } from '../query';
import { inspect, TestExecutionResult } from '../test-result';

export class InspectStep implements DevStep {
  type: 'dev' = 'dev';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: string | Query | QueryList
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  async execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();

    // todo: get rid of `any`
    const type = isString(this.query) ? 'queryList' : reinterpret<Query>(this.query).type
    switch (type) {
      case 'query': {
        const target = await page.immediateQuery(selector);
        return inspect({ selector, target });
      }

      case 'queryList': {
        const target = await page.immediateQueryList(selector);
        return inspect({ selector, target });
      }

      default: {
        throw errors.invalidArgument('type', type);
      }
    }
  }

  toString(): string {
    return '__inspect';
  }
}