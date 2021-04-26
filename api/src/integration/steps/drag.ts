import { Guard } from '../../utils/guard';
import { Select } from '../selector';
import { Step, StepContext } from '../step';
import { TestExecutionResult } from '../test-result';

export class DragStep implements Step {
  constructor(
    private selector: Select<any>,
    private x: number,
    private y: number
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;
    return attempt(() => engine.drag(this.selector.query, this.x, this.y));
  }

  toString() {
    return `drag x:${this.x}, y:${this.y}`
  }
}