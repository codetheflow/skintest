import { ActionStep } from './steps/action';
import { AmOnPageStep } from './steps/am-on-page';
import { AssertStep, TestStep, DevStep, InfoStep, DoStep, ClientStep } from './command';
import { BinaryAssert, ListAssert, UnaryAssert } from './assert';
import { Breakpoint, DebugStep } from './steps/debug';
import { CheckStep } from './steps/check';
import { ClickStep } from './steps/click';
import { ClientDo, ClientRecipe, ServerDo, ServerRecipe } from './recipe';
import { DOMElement } from './dom';
import { Ego } from './ego';
import { FillStep } from './steps/fill';
import { FocusStep } from './steps/focus';
import { GoBackStep } from './steps/go-back';
import { GoForwardStep } from './steps/go-forward';
import { HoverStep } from './steps/hover';
import { InspectStep } from './steps/inspect';
import { KeyboardKey } from './keyboard';
import { PauseStep } from './steps/pause';
import { PressStep } from './steps/press';
import { Query, QueryList } from './query';
import { ReloadStep } from './steps/reload';
import { SayStep } from './steps/say';
import { SeeStep } from './steps/see';
import { StartTestStep } from './steps/test';
import { TypeStep } from './steps/type';
import { UncheckStep } from './steps/uncheck';
import { WaitUrlStep } from './steps/wait-url';
import { DblClickStep } from './steps/dblclick';

class Me implements Ego {
  check<E extends DOMElement>(query: Query<E>): ClientStep {
    return new CheckStep(query);
  }

  dblclick<E extends DOMElement>(query: Query<E>): ClientStep {
    return new DblClickStep(query);
  }

  type<E extends DOMElement>(query: Query<E>, value: string): ClientStep {
    return new TypeStep(query, value);
  }

  uncheck<E extends DOMElement>(query: Query<E>): ClientStep {
    return new UncheckStep(query);
  }

  go(direction: 'forward' | 'back'): ClientStep {
    switch (direction) {
      case 'forward': return new GoForwardStep();
      case 'back': return new GoBackStep();
    }
  }

  reload(): ClientStep {
    return new ReloadStep();
  }

  do<T extends (...args: any) => ClientDo>(recipe: ClientRecipe<T>, ...args: Parameters<T>): DoStep;
  do<T extends (...args: any) => ServerDo>(recipe: ServerRecipe<T>, ...args: Parameters<T>): DoStep;
  do(recipe: any, args?: any[]) {
    return new ActionStep(recipe, args || []);
  }

  test(message: string): TestStep {
    return new StartTestStep(message);
  }

  see<E extends DOMElement>(query: Query<E>): AssertStep;
  see<E extends DOMElement>(query: Query<E>, assert: UnaryAssert): AssertStep;
  see<E extends DOMElement, V>(query: Query<E>, assert: BinaryAssert<V>, value: V): AssertStep;
  see<E extends DOMElement, V>(query: QueryList<E>, assert: ListAssert<V>, value: V): AssertStep;
  see(query: any, assert?: any, value?: any): AssertStep {
    return new SeeStep(query, assert, value);
  }

  // dontSee<E extends DOMElement>(query: Query<E>): AssertStep;
  // dontSee<E extends DOMElement>(query: Query<E>, assert: UnaryAssert): AssertStep;
  // dontSee<E extends DOMElement, V>(query: Query<E>, assert: BinaryAssert<V>, value: V): AssertStep;
  // dontSee<E extends DOMElement, V>(query: QueryList<E>, assert: ListAssert<V>, value: V): AssertStep;
  // dontSee(query: any, assert?: any, value?: any): AssertStep {
  //   return new DontSeeStep(query, assert, value);
  // }

  visit(url: string): ClientStep {
    return new AmOnPageStep(url);
  }

  wait(url: string): ClientStep {
    return new WaitUrlStep(url);
  }

  click<E extends DOMElement>(query: Query<E>): ClientStep {
    return new ClickStep(query);
  }

  hover<E extends DOMElement>(query: Query<E>): ClientStep {
    return new HoverStep(query);
  }

  press(key: KeyboardKey): ClientStep {
    return new PressStep(key);
  }

  fill<E extends DOMElement>(query: Query<E>, value: string): ClientStep {
    return new FillStep(query, value);
  }

  focus<E extends DOMElement>(query: Query<E>): ClientStep {
    return new FocusStep(query);
  }

  // drag<E extends DOMElement>(query: Query<E>, x: number, y: number): ClientStep {
  //   return new DragStep(query, x, y);
  // }

  // attachFile(from: Query<HTMLFormElement>, file: any): ClientStep {
  //   return new AttachFileStep(from, file);
  // }

  say(message: string): InfoStep {
    return new SayStep(message);
  }

  __debug(breakpoint: Breakpoint): DevStep {
    return new DebugStep(breakpoint)
  }

  __inspect<T extends DOMElement>(selector: string | Query<T> | QueryList<T>): DevStep {
    return new InspectStep(selector);
  }

  __pause(): DevStep {
    return new PauseStep();
  }
}

export const I: Ego = new Me();