import { Guard } from '@skintest/common';
import { asTest, ClientStep, StepContext, StepExecutionResult } from '../command';
import { StepMeta } from '../meta';

export class NavigationBackStep implements ClientStep {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<StepMeta>
    ) {
      Guard.notNull(getMeta, 'getMeta');
  }

  execute(context: StepContext): StepExecutionResult {
    const { browser } = context;

    const page = browser.getCurrentPage();
    return asTest(page.goBack());
  }

  toString(): string {
    return `I go back`;
  }
}