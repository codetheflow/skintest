import { errors, getCaller, getMeta, Guard, Meta, Optional } from '@skintest/common';
import { ClientStep, StepContext, StepExecutionResult, TaskIterable, TaskOperator } from '@skintest/sdk';
import * as pw from 'playwright';
import { PlaywrightBrowser } from './playwright-browser';
import { PlaywrightPage } from './playwright-page';

export type PlaywrightPerformActionContext = {
  browser: pw.Browser,
  host: {
    getCurrentPage(): pw.Page;
    openPage(id: string): Promise<void>;
    closePage(id: string): Promise<void>;
    close(): Promise<void>;
  }
}

export function playwrightPerform(message: string, action: (context: PlaywrightPerformActionContext) => Promise<void>): TaskOperator<Optional<TaskIterable>, TaskIterable> {
  const caller = getCaller();
  const getStepMeta = () => getMeta(caller);

  return source => [...(source || []), new PlaywrightPerformStep(getStepMeta, message, action)];
}


export class PlaywrightPerformStep<D> implements ClientStep<D> {
  type: 'client' = 'client';

  constructor(
    public getMeta: () => Promise<Meta>,
    private message: string,
    private action: (context: PlaywrightPerformActionContext) => Promise<void>
  ) {
    Guard.notNull(getMeta, 'getMeta');
    Guard.notNull(action, 'action');
  }

  async execute(context: StepContext): Promise<StepExecutionResult> {
    const browserWrapper = context.browser as PlaywrightBrowser;
    const browser = browserWrapper.browser;
    if (!browser) {
      throw errors.invalidOperation('browser is not found, tests are running not under the playwright');
    }

    await this.action({
      browser,
      host: {
        getCurrentPage() {
          const pageWrapper = (browserWrapper.getCurrentPage() as PlaywrightPage).page;
          return pageWrapper;
        },
        openPage(id: string) {
          return browserWrapper.openPage(id);
        },
        closePage(id: string) {
          return browserWrapper.closePage(id);
        },
        close() {
          return browserWrapper.close();
        }
      }
    });

    return {
      type: 'method',
    };
  }

  toString(): string {
    return `playwright perform ${this.message}`;
  }
}