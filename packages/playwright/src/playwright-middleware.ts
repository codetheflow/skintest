import { errors, reinterpret } from '@skintest/common';
import * as pw from 'playwright';

// 1. select browser type
// 2. setup launch setting
// 3. launch browser type
// 4. setup browser context options
// 4. create a browser context
// 4. create a new page
// 5. close browser

type BrowserTypeSite = { state: pw.BrowserType };
type BrowserNewSite = { state: pw.LaunchOptions };
type ContextNewSite = { id: string, browser: pw.Browser, state: pw.BrowserContextOptions };
type PageNewSite = { id: string, browser: pw.Browser, state: pw.Page };

export interface PlaywrightUse<S extends PlaywrightUseSite> {
  site: S
  accept(context: Parameters<PlaywrightUseCatalog[S]>[0]): ReturnType<PlaywrightUseCatalog[S]>;
}

type PlaywrightUseSite =
  'browser:type'
  | 'browser:options'
  | 'context:options'
  | 'page:new';

interface PlaywrightUseCatalog {
  'browser:type': (context: BrowserTypeSite) => Promise<pw.BrowserType>;
  'browser:options': (context: BrowserNewSite) => Promise<pw.LaunchOptions>;
  'context:options': (context: ContextNewSite) => Promise<pw.BrowserContextOptions>;
  'page:new': (context: PageNewSite) => Promise<pw.Page>;
}

export function playwrightUse<S extends PlaywrightUseSite>(site: S, callback: PlaywrightUseCatalog[S]): PlaywrightUse<S> {
  return {
    site,
    accept<R = ReturnType<PlaywrightUseCatalog[S]>>(context: Parameters<PlaywrightUseCatalog[S]>[0]): R {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arg = reinterpret<any>(context);
      const result = callback(arg);
      return reinterpret<R>(result);
    }
  };
}

export class PlaywrightMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private useList: PlaywrightUse<any>[]) { }

  async accept<S extends PlaywrightUseSite>(site: S, context: Parameters<PlaywrightUseCatalog[S]>[0]): Promise<ReturnType<PlaywrightUseCatalog[S]>> {
    const useList = this.useList.filter(x => x.site === site);
    if (useList.length === 0) {
      throw errors.invalidOperation(`at least one middleware of type ${site} should be presented`);
    }

    // for debugging using here `for (let i = 0; ...)`, not `for of`
    for (let i = 0, length = useList.length; i < length; i++) {
      const use = reinterpret<PlaywrightUse<S>>(useList[i]);
      const nextState = await use.accept(context);
      context.state = nextState;
    }

    return context.state;
  }
}