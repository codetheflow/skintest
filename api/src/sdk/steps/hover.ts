import { Guard } from '../../common/guard';
import { formatSelector } from '../format';
import { Query } from '../query';
import { ClientStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class HoverStep implements ClientStep {
  type: 'client' = 'client';
  
  constructor(
    private query: Query<any>
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, driver } = context;

    const selector = this.query.toString();
    return attempt(() => driver.hover(selector));
  }

  toString() {
    const selector = this.query.toString();
    return `I hover ${formatSelector(selector)}`;
  }
}
