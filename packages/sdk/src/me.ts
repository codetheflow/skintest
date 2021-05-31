import { BinaryAssert, ListBinaryAssert } from './assert';
import { AssertStep, ClientStep, DevStep, DoStep, InfoStep, TestStep } from './command';
import { DOMElement } from './dom';
import { Ego } from './ego';
import { KeyboardKey } from './keyboard';
import { getCaller, getStepMeta } from './meta';
import { Query, QueryList } from './query';
import { ClientDo, ClientRecipe } from './recipes/client';
import { ServerDo, ServerRecipe } from './recipes/server';
import { ThatFunction, ThatRecipe } from './recipes/that';
import { ClickStep } from './steps/click';
import { ClientActionStep } from './steps/client-action';
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
import { ServerActionStep } from './steps/server-action';
import { ExecuteStep } from './steps/test';
import { ThatActionStep } from './steps/that-action';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  do<T extends (...args: any) => ClientDo>(recipe: ClientRecipe<T>, ...args: Parameters<T>): DoStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  do<T extends (...args: any) => ServerDo>(recipe: ServerRecipe<T>, ...args: Parameters<T>): DoStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  do(recipe: ClientRecipe<any> | ServerRecipe<any>, ...args: any[]) {
    const caller = getCaller();
    if (recipe.type === 'client') {
      return new ClientActionStep(() => getStepMeta(caller), recipe, args || []);
    }

    return new ServerActionStep(() => getStepMeta(caller), recipe, args || []);
  }

  test(message: string): TestStep {
    const caller = getCaller();
    return new ExecuteStep(() => getStepMeta(caller), message);
  }

  see<A extends ThatFunction>(recipe: ThatRecipe<A>, ...args: Parameters<A>): AssertStep;
  see<E extends DOMElement, V>(target: Query<E>, assert: BinaryAssert<V>, value: V): AssertStep;
  see<E extends DOMElement, V>(target: QueryList<E>, assert: ListBinaryAssert<V>, value: V): AssertStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  see(targetOrRecipe: any, ...args: any[]): AssertStep {
    const caller = getCaller();
    if (targetOrRecipe.type === 'assert') {
      return new ThatActionStep(() => getStepMeta(caller), targetOrRecipe, args);
    }

    return new SeeStep(() => getStepMeta(caller), targetOrRecipe, args[0], args[1]);
  }

  goto(url: string): ClientStep {
    const caller = getCaller();
    return new GotoStep(() => getStepMeta(caller), url);
  }

  wait(what: 'url', url: string): ClientStep {
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