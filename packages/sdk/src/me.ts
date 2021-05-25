import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, ClientStep, DevStep, DoStep, InfoStep, TestStep } from './command';
import { DOMElement } from './dom';
import { Ego } from './ego';
import { KeyboardKey } from './keyboard';
import { getCaller, getStepMeta } from './meta';
import { Query, QueryList } from './query';
import { ClientDo, ClientRecipe, ServerDo, ServerRecipe } from './recipe';
import { ActionStep } from './steps/action';
import { ClickStep } from './steps/click';
import { DblClickStep } from './steps/dblclick';
import { Breakpoint, DebugStep } from './steps/debug';
import { FillStep } from './steps/fill';
import { FocusStep } from './steps/focus';
import { GotoStep } from './steps/goto';
import { HoverStep } from './steps/hover';
import { InspectStep } from './steps/inspect';
import { MarkStep } from './steps/mark';
import { NavigationBackStep } from './steps/navigation-back';
import { NavigationForwardStep } from './steps/navigation-forward';
import { OpenStep } from './steps/open';
import { PauseStep } from './steps/pause';
import { PressStep } from './steps/press';
import { ReloadStep } from './steps/reload';
import { SayStep } from './steps/say';
import { SeeStep } from './steps/see';
import { SelectTextStep } from './steps/select-text';
import { ExecuteStep } from './steps/test';
import { TypeStep } from './steps/type';
import { WaitUrlStep } from './steps/wait-url';

class Me implements Ego {
  mark<E extends DOMElement>(target: Query<E>, value: 'checked' | 'unchecked'): ClientStep {
    const caller = getCaller();
    return new MarkStep(() => getStepMeta(caller), target, value);
  }

  select<E extends DOMElement>(target: Query<E>): ClientStep {
    const caller = getCaller();
    return new SelectTextStep(() => getStepMeta(caller), target);
  }

  open(name: string): ClientStep {
    const caller = getCaller();
    return new OpenStep(() => getStepMeta(caller), name);
  }

  dblclick<E extends DOMElement>(query: Query<E>): ClientStep {
    const caller = getCaller();
    return new DblClickStep(() => getStepMeta(caller), query);
  }

  type<E extends DOMElement>(target: Query<E>, value: string): ClientStep {
    const caller = getCaller();
    return new TypeStep(() => getStepMeta(caller), target, value);
  }

  navigate(direction: 'forward' | 'back'): ClientStep {
    const caller = getCaller();
    switch (direction) {
      case 'forward': return new NavigationForwardStep(() => getStepMeta(caller));
      case 'back': return new NavigationBackStep(() => getStepMeta(caller));
    }
  }

  reload(): ClientStep {
    const caller = getCaller();
    return new ReloadStep(() => getStepMeta(caller));
  }

  do<T extends (...args: any) => ClientDo>(recipe: ClientRecipe<T>, ...args: Parameters<T>): DoStep;
  do<T extends (...args: any) => ServerDo>(recipe: ServerRecipe<T>, ...args: Parameters<T>): DoStep;
  do(recipe: any, args?: any[]) {
    const caller = getCaller();
    return new ActionStep(() => getStepMeta(caller), recipe, args || []);
  }

  test(message: string): TestStep {
    const caller = getCaller();
    return new ExecuteStep(() => getStepMeta(caller), message);
  }

  see<E extends DOMElement>(target: Query<E>): AssertStep;
  see<E extends DOMElement, V>(target: Query<E>, assert: BinaryAssert<V>, value: V): AssertStep;
  see<E extends DOMElement, V>(target: QueryList<E>, assert: ListBinaryAssert<V>, value: V): AssertStep;
  see(target: any, assert?: any, value?: any): AssertStep {
    const caller = getCaller();
    return new SeeStep(() => getStepMeta(caller), target, assert, value);
  }

  goto(url: string): ClientStep {
    const caller = getCaller();
    return new GotoStep(() => getStepMeta(caller), url);
  }

  wait(url: string): ClientStep {
    const caller = getCaller();
    return new WaitUrlStep(() => getStepMeta(caller), url);
  }

  click<E extends DOMElement>(target: Query<E>): ClientStep {
    const caller = getCaller();
    return new ClickStep(() => getStepMeta(caller), target);
  }

  hover<E extends DOMElement>(target: Query<E>): ClientStep {
    const caller = getCaller();
    return new HoverStep(() => getStepMeta(caller), target);
  }

  press(key: KeyboardKey): ClientStep {
    const caller = getCaller();
    return new PressStep(() => getStepMeta(caller), key);
  }

  fill<E extends DOMElement>(target: Query<E>, value: string): ClientStep {
    const caller = getCaller();
    return new FillStep(() => getStepMeta(caller), target, value);
  }

  focus<E extends DOMElement>(target: Query<E>): ClientStep {
    const caller = getCaller();
    return new FocusStep(() => getStepMeta(caller), target);
  }

  say(message: string): InfoStep {
    const caller = getCaller();
    return new SayStep(() => getStepMeta(caller), message);
  }

  __debug(breakpoint: Breakpoint): DevStep {
    const caller = getCaller();
    return new DebugStep(() => getStepMeta(caller), breakpoint)
  }

  __inspect<T extends DOMElement>(selector: string | Query<T> | QueryList<T>): DevStep {
    const caller = getCaller();
    return new InspectStep(() => getStepMeta(caller), selector);
  }

  __pause(): DevStep {
    const caller = getCaller();
    return new PauseStep(() => getStepMeta(caller),);
  }
}

export const I: Ego = new Me();