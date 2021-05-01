import { formatSelector } from '../formatting';
import { Guard } from '../../common/guard';
import { Select } from '../selector';
import { UIStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';

export class DragStep implements UIStep {
  type: 'ui' = 'ui';
  
  constructor(
    private selector: Select<any>,
    private x: number,
    private y: number
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    const query = this.selector.toString();
    return attempt(() => engine.drag(query, this.x, this.y));
  }

  toString() {
    const query = this.selector.toString();
    return `I drag ${formatSelector(query)} x: ${this.x}, y: ${this.y}`
  }
}