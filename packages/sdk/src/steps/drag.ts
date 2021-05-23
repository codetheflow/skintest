import { Guard } from '@skintest/common';
import { ClientStep, StepContext } from '../command';
import { formatSelector } from '../format';
import { StepMeta } from '../meta';
import { Query } from '../query';
import { asTest, TestExecutionResult } from '../test-result';

export class DragStep implements ClientStep {
  type: 'client' = 'client';
  
  constructor(
    public getMeta: () => Promise<StepMeta>,
    private query: Query<any>,
    private x: number,
    private y: number
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): Promise<TestExecutionResult> {
    const { browser } = context;

    const page = browser.getCurrentPage();
    const selector = this.query.toString();
    return asTest(page.drag(selector, this.x, this.y));
  }

  toString(): string {
    const selector = this.query.toString();
    return `I drag ${formatSelector(selector)} x: ${this.x}, y: ${this.y}`
  }
}