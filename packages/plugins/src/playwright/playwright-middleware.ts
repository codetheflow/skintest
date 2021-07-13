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

export interface PlaywrightMiddlewareUse<S extends PlaywrightMiddlewareSite> {
  site: S
  accept(context: Parameters<PlaywrightMiddlewareCatalog[S]>[0]): ReturnType<PlaywrightMiddlewareCatalog[S]>;
}

type PlaywrightMiddlewareSite =
  'browser:type'
  | 'browser:new'
  | 'context:new'
  | 'page:new';

interface PlaywrightMiddlewareCatalog {
  'browser:type': (context: BrowserTypeSite) => Promise<pw.BrowserType[]>;
  'browser:new': (context: BrowserNewSite) => Promise<pw.LaunchOptions>;
  'context:new': (context: ContextNewSite) => Promise<pw.BrowserContextOptions>;
  'page:new': (context: PageNewSite) => Promise<void>;
}

export function playwrightMiddleware<S extends PlaywrightMiddlewareSite>(site: S, callback: PlaywrightMiddlewareCatalog[S]): PlaywrightMiddlewareUse<S> {
  return {
    site,
    accept<R = ReturnType<PlaywrightMiddlewareCatalog[S]>>(context: Parameters<PlaywrightMiddlewareCatalog[S]>[0]): R {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arg = reinterpret<any>(context);
      const result = callback(arg);
      return reinterpret<R>(result);
    }
  };
}

export class PlaywrightMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private middlewareList: PlaywrightMiddlewareUse<any>[]) { }

  async accept<S extends PlaywrightMiddlewareSite>(site: S, context: Parameters<PlaywrightMiddlewareCatalog[S]>[0]): Promise<ReturnType<PlaywrightMiddlewareCatalog[S]>> {
    const useList = this.middlewareList.filter(x => x.site === site);
    if (useList.length === 0) {
      throw errors.constraint(`at least one middleware of type ${site} should be presented`);
    }

    let state;
    for (const use of reinterpret<PlaywrightMiddlewareUse<S>[]>(useList)) {
      const nextState = await use.accept(context);
      state = nextState;
    }

    return state;
  }
}