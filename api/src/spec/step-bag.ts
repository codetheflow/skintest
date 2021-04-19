import { Select } from './selector';
import { Step, StepContext } from './step';

export class ClickStep implements Step {
  constructor(
    private selector: Select<any>
  ) { }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('click', this.selector.query);
    return engine.click(this.selector.query);
  }
}

export class PressStep implements Step {
  constructor(
    private key: string
  ) { }

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
  ) { }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('fill', `${this.selector.query} with '${this.value}'`);
    return engine.fill(this.selector.query, this.value);
  }
}

export class FocusStep implements Step {
  constructor(
    private selector: Select<any>,
  ) { }

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
  ) { }

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
  ) { }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('attach file', `'${this.file}' to ${this.selector.query}`);
    return engine.attachFile(this.selector.query, this.file);
  }
}

export class SeeStep implements Step {
  constructor(
    private target: any,
    private expected: any,
  ) { }

  execute(context: StepContext): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export class DontSeeStep implements Step {
  constructor(
    private target: any,
    private expected: any,
  ) { }

  execute(context: StepContext): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export class DoStep implements Step {
  constructor(
    private action: (...args: any) => Promise<void>,
    private args: any[]
  ) { }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('do');
    return this.action(...this.args);
  }
}

export class AmOnPageStep implements Step {
  constructor(
    private url: string
  ) { }

  execute(context: StepContext): Promise<void> {
    const { engine, report } = context;

    report('am on page', this.url);
    return engine.goto(this.url);
  }
}

export class WaitUrlStep implements Step {
  constructor(
    private url: string
  ) { }

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
