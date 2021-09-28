import { Boxed, Data, errors, getCaller, getMeta, reinterpret } from '@skintest/common';
import { ClientStep, KeyboardKey, Query, Value } from '@skintest/sdk';
import { Browser } from '../browser';
import { DOMElement } from '../dom';
import { ClickStep } from '../steps/click-step';
import { DblClickStep } from '../steps/dblclick-step';
import { EvaluateStep } from '../steps/evaluate-step';
import { FillStep } from '../steps/fill-step';
import { FocusStep } from '../steps/focus-step';
import { GotoStep } from '../steps/goto-step';
import { HoverStep } from '../steps/hover-step';
import { MarkStep } from '../steps/mark-step';
import { NavigationStep } from '../steps/navigate-step';
import { OpenStep } from '../steps/open-step';
import { PressStep } from '../steps/press-step';
import { ReloadStep } from '../steps/reload-step';
import { SelectTextStep } from '../steps/select-text-step';
import { TypeStep } from '../steps/type-step';
import { Download } from '../steps/wait-download-step';
import { FileDialog } from '../steps/wait-file-dialog-step';

type HandleEvents = {
  'download': Download,
  'file-dialog': FileDialog,
  // 'navigation': void | string | RegExp;
  // 'state': 'load' | 'domcontentloaded' | 'networkiddle'
};

export class CanBrowseTheWeb {
  private static defaultBrowser: Browser | null = null;
  private browser: Browser | null = null;

  static useByDefault(browser: Browser): void {
    CanBrowseTheWeb.defaultBrowser = browser;
  }

  // static using(browser: Browser): typeof CanBrowseTheWeb {
  //   return CanBrowseTheWeb;
  // }

  mark<D, E extends DOMElement>(target: Query<E>, value: Value<'checked' | 'unchecked', D>): ClientStep<D> {
    const caller = getCaller();
    return new MarkStep(() => getMeta(caller), this.getBrowser(), target, value);
  }

  select<D, E extends DOMElement>(what: 'text', target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new SelectTextStep(() => getMeta(caller), this.getBrowser(), target);
  }

  open<D>(what: 'page', name: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new OpenStep(() => getMeta(caller), this.getBrowser(), name);
  }

  handle<D, E extends keyof HandleEvents>(event: E, options: HandleEvents[E]): ClientStep<D> {
    return null as any;
  }

  dblclick<D, E extends DOMElement>(query: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new DblClickStep(() => getMeta(caller), this.getBrowser(), query);
  }

  type<D, E extends DOMElement>(target: Query<E>, value: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new TypeStep(() => getMeta(caller), this.getBrowser(), target, value);
  }

  navigate<D>(direction: Value<'forward' | 'back', D>): ClientStep<D> {
    const caller = getCaller();
    return new NavigationStep(() => getMeta(caller), this.getBrowser(), direction);
  }

  reload<D>(): ClientStep<D> {
    const caller = getCaller();
    return new ReloadStep(() => getMeta(caller), this.getBrowser());
  }

  goto<D>(url: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new GotoStep(() => getMeta(caller), this.getBrowser(), url);
  }

  click<D, E extends DOMElement>(target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new ClickStep(() => getMeta(caller), this.getBrowser(), target);
  }

  hover<D, E extends DOMElement>(target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new HoverStep(() => getMeta(caller), this.getBrowser(), target);
  }

  press<D>(key: Value<KeyboardKey, D>): ClientStep<D> {
    const caller = getCaller();
    return new PressStep(() => getMeta(caller), this.getBrowser(), key);
  }

  fill<D, E extends DOMElement>(target: Query<E>, value: Value<string, D>): ClientStep<D> {
    const caller = getCaller();
    return new FillStep(() => getMeta(caller), this.getBrowser(), target, value);
  }

  focus<D, E extends DOMElement>(target: Query<E>): ClientStep<D> {
    const caller = getCaller();
    return new FocusStep(() => getMeta(caller), this.getBrowser(), target);
  }

  evaluate<D extends Data>(arg: Boxed<D>, pageFunction: (arg: D) => void): ClientStep<D> {
    const caller = getCaller();
    return new EvaluateStep(() => getMeta(caller), this.getBrowser(), reinterpret<(arg: Data) => void>(pageFunction), arg.value);
  }

  // handle<D, E extends keyof HandleEvents>(event: E, options: HandleEvents[E]): EventStep<D> {
  //   const caller = getCaller();
  //   const getStepMeta = () => getMeta(caller);

  //   switch (event) {
  //     case 'download':
  //       return new EventStep(
  //         getStepMeta,
  //         new Indexed([new WaitDownloadStep(getStepMeta, this.getBrowser(), options as Download)]),
  //         new Indexed(Array.from(source)),
  //       );
  //     case 'file-dialog':
  //       return new EventStep(
  //         getStepMeta,
  //         new Indexed([new WaitFileDialogStep(getStepMeta, this.getBrowser(), options as FileDialog)]),
  //         new Indexed(Array.from(source)),
  //       );
  //     default: {
  //       throw errors.invalidArgument('event', event);
  //     }
  //   }
  // }

  private getBrowser(): Browser {
    const browser = this.browser || CanBrowseTheWeb.defaultBrowser;
    if (!browser) {
      throw errors.invalidOperation('browser is not setup');
    }

    return browser;
  }
}

// export class CanDebugBrowser {
//   __debug<D>(breakpoint: Breakpoint): DevStep<D> {
//     const caller = getCaller();
//     return new DebugStep(() => getMeta(caller), breakpoint);
//   }
// }