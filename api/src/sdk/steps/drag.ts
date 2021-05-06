import { formatSelector } from '../format';
import { Guard } from '../../common/guard';
import { Query } from '../query';
import { ClientStep, StepContext } from '../command';
import { asTest, TestExecutionResult } from '../test-result';

export class DragStep implements ClientStep {
  type: 'client' = 'client';
  
  constructor(
    private query: Query<any>,
    private x: number,
    private y: number
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { page } = context;

    const selector = this.query.toString();
    return asTest(page.drag(selector, this.x, this.y));
  }

  toString() {
    const selector = this.query.toString();
    return `I drag ${formatSelector(selector)} x: ${this.x}, y: ${this.y}`
  }
}