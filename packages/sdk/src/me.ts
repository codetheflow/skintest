import { isFunction } from '@skintest/common';
import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, ClientStep, ControlStep, DevStep, DoStep, InfoStep, TestStep } from './command';
import { DOMElement } from './dom';
import { Ego } from './ego';
import { KeyboardKey } from './keyboard';
import { getCaller, getStepMeta } from './meta';
import { Query, QueryList } from './query';
import { RecipeFunction } from './recipe';
import { ClickStep } from './steps/click';
import { DblClickStep } from './steps/dblclick';
import { Breakpoint, DebugStep } from './steps/debug';
import { FillStep } from './steps/fill';
import { FocusStep } from './steps/focus';
import { GotoStep } from './steps/goto';
import { HoverStep } from './steps/hover';
import { IIfStep } from './steps/iif';
import { InspectStep } from './steps/inspect';
import { MarkStep } from './steps/mark';
import { NavigationBackStep } from './steps/navigation-back';
import { NavigationForwardStep } from './steps/navigation-forward';
import { OpenStep } from './steps/open';
import { PauseStep } from './steps/pause';
import { PressStep } from './steps/press';
import { RecipeStep } from './steps/recipe';
import { ReloadStep } from './steps/reload';
import { SayStep } from './steps/say';
import { SeeStep } from './steps/see';
import { SelectTextStep } from './steps/select-text';
import { ExecuteStep } from './steps/test';
import { ThatStep } from './steps/that';
import { TillStep } from './steps/till';
import { TypeStep } from './steps/type';
import { WaitStep } from './steps/wait';
import { ThatFunction } from './that';

export function till(message: string): ControlStep {
  const caller = getCaller();
  return new TillStep(() => getStepMeta(caller), message);
}

export function iif(message: string): ControlStep {
  const caller = getCaller();
  return new IIfStep(() => getStepMeta(caller), message);
}

class Me implements Ego {
  wait<F extends ThatFunction>(recipe: F, ...args: Parameters<F>): ClientStep;
  wait<E extends DOMElement, V>(target: Query<E>, has: BinaryAssert<V>, value: V): ClientStep;
  wait<E extends DOMElement, V>(targets: QueryList<E>, has: ListBinaryAssert<V>, value: V): ClientStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wait(targetOrRecipe: any, ...args: any[]): ClientStep {
    const caller = getCaller();
    const assert = isFunction(targetOrRecipe)
      ? new ThatStep(() => getStepMeta(caller), targetOrRecipe, args)
      : new SeeStep(() => getStepMeta(caller), targetOrRecipe, args[0], args[1]);

    return new WaitStep(() => getStepMeta(caller), assert);
  }

  do<F extends RecipeFunction>(recipe: F, ...args: Parameters<F>): DoStep {
    const caller = getCaller();
    return new RecipeStep(() => getStepMeta(caller), recipe, args);
  }

  see<F extends ThatFunction>(recipe: F, ...args: Parameters<F>): AssertStep;
  see<E extends DOMElement, V>(target: Query<E>, has: BinaryAssert<V>, value: V): AssertStep;
  see<E extends DOMElement, V>(targets: QueryList<E>, has: ListBinaryAssert<V>, value: V): AssertStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  see(targetOrRecipe: any, ...args: any[]): AssertStep {
    const caller = getCaller();
    if (isFunction(targetOrRecipe)) {
      return new ThatStep(() => getStepMeta(caller), targetOrRecipe, args);
    }

    return new SeeStep(() => getStepMeta(caller), targetOrRecipe, args[0], args[1]);
  }

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

  test(message: string): TestStep {
    const caller = getCaller();
    return new ExecuteStep(() => getStepMeta(caller), message);
  }

  goto(url: string): ClientStep {
    const caller = getCaller();
    return new GotoStep(() => getStepMeta(caller), url);
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
    return new DebugStep(() => getStepMeta(caller), breakpoint);
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