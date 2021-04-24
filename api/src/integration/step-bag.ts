import { error } from '../utils/error';
import { isFalsy, isUndefined } from '../utils/check';
import { KeyboardKey } from './keyboard';
import { Select, SelectAll } from './selector';
import { Step, StepContext } from './step';
import { Assert, AssertAll, AssertHost } from './assert';
import { Stage } from './stage';
import { Guard } from 'src/utils/guard';

export class PauseStep implements Step {
  constructor() { }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('pause');
    return engine.pause();
  }
}

export class ClickStep implements Step {
  constructor(
    private selector: Select<any>
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('click', this.selector.query);
    return engine.click(this.selector.query);
  }
}

export class PressStep implements Step {
  constructor(
    private key: KeyboardKey
  ) {
    Guard.notNullOrEmpty(key, 'key');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('press', this.key);
    return engine.press(this.key);
  }
}

export class FillStep implements Step {
  constructor(
    private selector: Select<any>,
    private value: string,
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('fill', `${this.selector.query} with '${this.value}'`);
    return engine.fill(this.selector.query, this.value);
  }
}

export class FocusStep implements Step {
  constructor(
    private selector: Select<any>,
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('focus', this.selector.query);
    return engine.focus(this.selector.query);
  }
}

export class DragStep implements Step {
  constructor(
    private selector: Select<any>,
    private x: number,
    private y: number
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('drag', `${this.x}, ${this.y}`);
    return engine.drag(this.selector.query, this.x, this.y);
  }
}

export class AttachFileStep implements Step {
  constructor(
    private selector: Select<any>,
    private file: any,
  ) {
    Guard.notNull(selector, 'selector');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('attach file', `'${this.file}' to ${this.selector.query}`);
    return engine.attachFile(this.selector.query, this.file);
  }
}

export class SeeStep implements Step {
  constructor(
    private selector: Select<any> | SelectAll<any>,
    private assert: Assert<any> | AssertAll<any>,
    private value: any
  ) {
    Guard.notNull(selector, 'selector');
  }

  async execute(context: StepContext): Promise<void> {
    const { engine, report } = context;
    if (isUndefined(this.assert)) {
      switch (this.selector.type) {
        case 'select': {
          const element = await engine.select(this.selector.query);
          if (!element) {
            throw error('see', `can't find "${this.selector.query}" element`);
          }

          break;
        }
        case 'selectAll': {
          const elements = await engine.selectAll(this.selector.query);
          if (!elements.length) {
            throw error('see', `can't find "${this.selector.query}" elements`);
          }

          break;
        }
        // default: {
        //   throw error('see', `invalid argument ${this.targets.type}`);
        // }
      }

      report('see', this.selector.query);
    } else {
      const stage = new Stage(engine);
      const { what, how } = this.assert as AssertHost<any>;

      switch (this.selector.type) {
        case 'select': {
          await stage.test(this.selector, what, how, this.value);
          break;
        }
        case 'selectAll': {
          await stage.testAll(this.selector, what, how, this.value);
          break;
        }
        // default: {
        //   throw error('see', `invalid argument ${this.targets.type}`);
        // }
      }

      report('see', `that ${this.selector.query} has ${what} ${how} ${this.value}`);
    }

    return Promise.resolve();
  }
}

export class DontSeeStep implements Step {
  constructor(
    private selector: Select<any> | SelectAll<any>,
    private assert: Assert<any> | AssertAll<any>,
    private value: any
  ) {
    Guard.notNull(selector, 'selector');
  }

  async execute(context: StepContext): Promise<void> {
    // TODO: improve

    const seeStep = new SeeStep(this.selector, this.assert, this.value);
    try {
      await seeStep.execute(context);
    } catch (ex) {
      return Promise.resolve();
    }


    throw error('dontsee', `${this.selector.query}`);
  }
}

export class DoStep implements Step {
  constructor(
    private action: (...args: any) => Promise<void>,
    private args: any[]
  ) {
    Guard.notNull(action, 'action');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('do');
    return this.action(...this.args);
  }
}

export class AmOnPageStep implements Step {
  constructor(
    private url: string
  ) {
    Guard.notNullOrEmpty(url, 'url');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('am on page', this.url);
    return engine.goto(this.url);
  }
}

export class WaitUrlStep implements Step {
  constructor(
    private url: string
  ) {
    Guard.notNull(url, 'url');
  }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('wait url', this.url);
    return engine.waitForNavigation(this.url);
  }
}

export class SayStep implements Step {
  constructor(
    private message: string
  ) { }

  execute(context: StepContext): Promise<void> {
    const { report } = context;

    report('say', this.message);
    return Promise.resolve();
  }
}
