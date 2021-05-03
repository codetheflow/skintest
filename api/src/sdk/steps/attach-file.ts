import { Guard } from '../../common/guard';
import { Query } from '../query';
import { ClientStep, StepContext } from '../command';
import { TestExecutionResult } from '../test-result';
import { formatSelector } from '../format';

export class AttachFileStep implements ClientStep {
  type: 'client' = 'client';
  
  constructor(
    private query: Query<any>,
    private file: any,
  ) {
    Guard.notNull(query, 'query');
  }

  execute(context: StepContext): TestExecutionResult {
    const { attempt, engine } = context;

    const selector = this.query.toString();
    return attempt(() => engine.attachFile(selector, this.file));
  }

  toString() {
    const selector = this.query.toString();
    return `I attach file \`${this.file}\` to ${formatSelector(selector)}`
  }
}
