import { getCaller, getMeta, isFunction } from '@skintest/common';
import { AssertStep, CheckStep, ClientStep, DevStep, DoStep, InfoStep } from './command';
import { DOMElement } from './dom';
import { Ego } from './ego';
import { KeyboardKey } from './keyboard';
import { Query } from './query';
import { CheckExecuteStep } from './steps/check';
import { ClickStep } from './steps/click';
import { DblClickStep } from './steps/dblclick';
import { Breakpoint, DebugStep } from './steps/debug';
import { FillStep } from './steps/fill';
import { FocusStep } from './steps/focus';
import { GotoStep } from './steps/goto';
import { HoverStep } from './steps/hover';
import { MarkStep } from './steps/mark';
import { NavigationStep } from './steps/navigate';
import { OpenStep } from './steps/open';
import { PauseStep } from './steps/pause';
import { PressStep } from './steps/press';
import { ReloadStep } from './steps/reload';
import { SayStep } from './steps/say';
import { SeeStep } from './steps/see';
import { SelectTextStep } from './steps/select-text';
import { TaskStep } from './steps/task';
import { ThatStep } from './steps/that';
import { TypeStep } from './steps/type';
import { WaitStep } from './steps/wait';
import { TaskFunction } from './task';
import { Value } from './value';

class Actor implements Ego {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wait<D>(targetOrTask: any, ...args: any[]): ClientStep<D> {
    const caller = getCaller();
    const assert = isFunction(targetOrTask)
      ? new ThatStep(() => getMeta(caller), targetOrTask, args)
      : new SeeStep(() => getMeta(caller), targetOrTask, args[0], args[1]);

    return new WaitStep(() => getMeta(caller), assert);
  }

  do<D, F extends TaskFunction>(task: F, ...args: Parameters<F>): DoStep<D> {
    const caller = getCaller();
    return new TaskStep(() => getMeta(caller), task, args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  see<D>(targetOrTask: any, ...args: any[]): AssertStep<D> {
    const caller = getCaller();
    if (isFunction(targetOrTask)) {
      return new ThatStep(() => getMeta(caller), targetOrTask, args);
    }

    return new SeeStep(() => getMeta(caller), targetOrTask, args[0], args[1]);
  }

  mark<D, E extends DOMElement>(target: Query<E>, value: Value<'checked' | 'unchecked', D>): ClientStep<D> {
    const caller = getCaller();
    return new MarkStep(() => getMeta(caller), target, value);
  }

  select<D, E extends DOMElement>(what: 'text', target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new SelectTextStep(() => getMeta(caller), target);
  }

  open<D>(name: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new OpenStep(() => getMeta(caller), name);
  }

  dblclick<D, E extends DOMElement>(query: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new DblClickStep(() => getMeta(caller), query);
  }

  type<D, E extends DOMElement>(target: Query<E>, value: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new TypeStep(() => getMeta(caller), target, value);
  }

  navigate<D>(direction: Value<'forward' | 'back', D>): ClientStep<D> {
    const caller = getCaller();
    return new NavigationStep(() => getMeta(caller), direction);
  }

  reload<D>(): ClientStep<D> {
    const caller = getCaller();
    return new ReloadStep(() => getMeta(caller));
  }

  check<D>(message: string): CheckStep<D> {
    const caller = getCaller();
    return new CheckExecuteStep(() => getMeta(caller), message);
  }

  goto<D>(url: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new GotoStep(() => getMeta(caller), url);
  }

  click<D, E extends DOMElement>(target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new ClickStep(() => getMeta(caller), target);
  }

  hover<D, E extends DOMElement>(target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new HoverStep(() => getMeta(caller), target);
  }

  press<D>(key: Value<KeyboardKey, D>): ClientStep<D> {
    const caller = getCaller();
    return new PressStep(() => getMeta(caller), key);
  }

  fill<D, E extends DOMElement>(target: Query<E>, value: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new FillStep(() => getMeta(caller), target, value);
  }

  focus<D, E extends DOMElement>(target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new FocusStep(() => getMeta(caller), target);
  }

  say<D>(message: string): InfoStep<D> {
    const caller = getCaller();
    return new SayStep(() => getMeta(caller), message);
  }

  __debug<D>(breakpoint: Breakpoint): DevStep<D> {
    const caller = getCaller();
    return new DebugStep(() => getMeta(caller), breakpoint);
  }

  __pause<D>(): DevStep<D> {
    const caller = getCaller();
    return new PauseStep(() => getMeta(caller),);
  }
}

export const I: Ego = new Actor();