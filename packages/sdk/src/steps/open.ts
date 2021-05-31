import { Guard } from '@skintest/common';
import { asTest, ClientStep, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class OpenStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>,
    private name: string
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notEmpty(name, 'name');
  }

  execute(context: StepContext): StepExecutionResult {
    const { browser } = context;

    return asTest(browser.openPage(this.name));
  }

  toString(): string {
    return `I open ${this.name}`;
  }
}