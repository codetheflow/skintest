import { Guard } from '../../common/guard';
import { ClientStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { Query } from '../query';
import { Meta } from '../reflect';
import { asTest, TestExecutionResult } from '../test-result';

export class AttachFileStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public meta: Promise<Meta>,
    private query: Query<any>,
    private file: any,
  ) {
    Guard.notNull(meta, 'meta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.attachFile(selector, this.file));
  }

  toString() {
    const selector = this.query.toString();
    return `I attach file \`${this.file}\` to ${formatSelector(selector)}`
  }
}
