import { errors, Guard, isObject, qte } from '@skintest/common';
import { fail, TestResult } from '@skintest/sdk';
import { CommandScope } from './stage';

export type FeedbackResult = {
  signal: 'break' | 'continue' | 'exit';
  issuer: Array<Error | TestResult>;
};

export class Feedback {
  private feedback = async (): Promise<FeedbackResult> => {
    const { path, step } = this.scope;
    const { issuer } = this;

    if (isObject(issuer) && 'signal' in issuer) {
      // we have feedback already, so just return it
      return issuer;
    }

    if (issuer instanceof Error) {
      // unhandled error means to exit
      return {
        signal: 'exit',
        issuer: [issuer]
      };
    }

    if (isObject(issuer) && 'status' in issuer) {
      if (issuer.status === 'pass') {
        return {
          signal: 'continue',
          issuer: [issuer]
        };
      }

      const [, command] = step;
      if (command.type === 'assert') {
        const host = path[path.length - 1];
        if (host === 'condition' || host === 'repeat') {
          // break loop or return false in the condition statement
          return {
            signal: 'break',
            issuer: [issuer]
          };
        }

        // assume that assertions are pure operations,
        // so continue next steps even current assert was failed
        return {
          signal: 'continue',
          issuer: [issuer],
        };
      }
    }

    return {
      signal: 'exit',
      issuer: [fail.reason({
        description: `unknown issuer ${qte('' + issuer)}`,
        solution: 'debug'
      })]
    };
  };

  constructor(
    private scope: Omit<CommandScope, 'feedback'>,
    private issuer: Error | TestResult | FeedbackResult
  ) {
    Guard.notNull(scope, 'scope');
    Guard.notNull(issuer, 'issuer');
  }

  get(): Promise<FeedbackResult> {
    return this.feedback();
  }

  override(feedback: () => Promise<FeedbackResult>): void {
    Guard.notNull(feedback, 'feedback');

    this.feedback = feedback;
  }
}

export class FeedbackList {
  private items: FeedbackResult[] = [];
  private static priority: Array<FeedbackResult['signal']> = ['continue', 'break', 'exit'];

  add(feedback: FeedbackResult): void {
    this.items.push(feedback);
  }

  last(): FeedbackResult {
    if (this.items.length === 0) {
      throw errors.invalidOperation('can\'t get last feedback, list is empty');
    }

    return this.items[this.items.length - 1];
  }

  ok(): boolean {
    return this.reduce().signal === 'continue';
  }

  reduce(): FeedbackResult {
    return this.items.reduce((memo, x) => {
      memo.issuer.push(...x.issuer);
      const mp = FeedbackList.priority.indexOf(memo.signal);
      const xp = FeedbackList.priority.indexOf(x.signal);
      if (xp > mp) {
        memo.signal = x.signal;
      }

      return memo;
    }, {
      signal: 'continue',
      issuer: []
    });
  }
}