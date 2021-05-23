import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { StepMeta } from '../meta';
import { asTest, TestExecutionResult } from '../test-result';

export class OpenStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private name: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(name, 'name');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    return asTest(browser.openPage(this.name));
  }

  toString(): string {
    return `I open ${this.name}`;
  }
}