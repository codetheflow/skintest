import { errors, reinterpret } from '@skintest/common';
import * as pw from 'playwright';

// 1. select browser type
// 2. setup launch setting
// 3. launch browser type
// 4. setup browser context options
// 4. create a browser context
// 4. create a new page
// 5. close browser

type BrowserTypeSite = { types: pw.BrowserType[] };
type BrowserNewSite = { type: pw.BrowserType, options: pw.LaunchOptions };
type ContextNewSite = { id: string, browser: pw.Browser, options: pw.BrowserContextOptions };
type PageNewSite = { id: string, browser: pw.Browser, context: pw.BrowserContext, page: pw.Page };

export interface PlaywrightUse<S extends PlaywrightUseSite> {
  site: S
  accept(context: Parameters<PlaywrightUseCatalog[S]>[0]): ReturnType<PlaywrightUseCatalog[S]>;
}

type PlaywrightUseSite =
  'browser:types'
  | 'browser:options'
  | 'context:options'
  | 'page:new';

interface PlaywrightUseCatalog {
  'browser:types': (context: BrowserTypeSite) => Promise<pw.BrowserType[]>;
  'browser:options': (context: BrowserNewSite) => Promise<pw.LaunchOptions>;
  'context:options': (context: ContextNewSite) => Promise<pw.BrowserContextOptions>;
  'page:new': (context: PageNewSite) => Promise<void>;
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

    let state;
    for (const use of reinterpret<PlaywrightUse<S>[]>(useList)) {
      const nextState = await use.accept(context);
      state = nextState;
    }

    return state;
  }
}