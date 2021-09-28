import { errors, Guard } from '@skintest/common';
import { NumberHas, Query, QueryList, TextHas, WhatAssert } from '@skintest/sdk';
import { Browser } from './browser';
import { DOMElement } from './dom';

// type WebAssert<V> = Assert<Query, V>;
// type WbAssertList<V> = Assert<QueryList, V>;

// export class KeyValueHas {
//   constructor(private what: WhatAssert<Query<DOMElement>, KeyValue<string>>) {
//   }

//   get like(): WebAssert<KeyValue<string>> {
//     return {
//       what: this.what,
//       how: new EqualsTextAssert(),
//     };
//   }
// }

// export class ElementStateHas {
//   constructor(private what: WhatAssert<Query<DOMElement>, ElementState>) {
//   }

//   get equals(): WebAssert<ElementState> {
//     return {
//       what: this.what,
//       how: new EqualsTextAssert(),
//     };
//   }
// }

export interface Has {
  // class: TextHas<Query>;
  // state: ElementStateHas,
  // attribute: KeyValueHas;
  // style: KeyValueHas;
  text: TextHas<Query>;
}

export interface ListHas {
  length: NumberHas<QueryList>;
}

export class WebAssertion implements Has, ListHas {
  private static defaultBrowser: Browser | null = null;
  private browser: Browser | null = null;
  private not = false;

  static useByDefault(browser: Browser): void {
    WebAssertion.defaultBrowser = browser;
  }

  get no(): WebAssertion {
    const negative = new WebAssertion();
    negative.not = true;
    return negative;
  }

  // get attribute(): KeyValueHas {

  // }

  // get style(): KeyValueHas {

  // }

  get text(): TextHas<Query> {
    const browser = this.getBrowser();
    const what: WhatAssert<Query<DOMElement>, string> = {
      async select(source: Query<DOMElement>): Promise<string> {
        Guard.notNull(source, 'source');

        const page = browser.getCurrentPage();
        const selector = source.toString();
        const element = await page.query(selector);
        if (!element) {
          throw errors.elementNotFound(selector);
        }

        return await element.text();
      }
    };

    return new TextHas(what);
  }

  get length(): NumberHas<QueryList> {
    const browser = this.getBrowser();
    const what: WhatAssert<QueryList<DOMElement>, number> = {
      async select(value: QueryList<DOMElement>): Promise<number> {
        Guard.notNull(value, 'value');

        const page = browser.getCurrentPage();
        const selector = value.toString();
        const elements = await page.queryList(selector);
        return elements.length;
      }
    };

    return new NumberHas(what);
  }

  // get state(): ElementStateHas {
  //   return new ElementStateHas()
  // }

  // get class(): TextHas<> {
  //   const browser = this.getBrowser();
  //   const what: WhatAssert<Query<DOMElement>, string> = {
  //     async select(source: Query<DOMElement>): Promise<string> {
  //       Guard.notNull(source, 'source');

  //       const page = browser.getCurrentPage();
  //       const selector = source.toString();
  //       const element = await page.query(selector);
  //       if (!element) {
  //         throw errors.elementNotFound(selector);
  //       }

  //       return await element.classList();
  //     }
  //   };

  //   return new TextHas(what);
  // }

  private getBrowser(): Browser {
    const browser = this.browser || WebAssertion.defaultBrowser;
    if (!browser) {
      throw errors.invalidOperation('browser is not setup');
    }

    return browser;
  }
}

export type HasNo = Has & { no: Has };
export type ListHasNo = ListHas & { no: ListHas }

export const has: HasNo & ListHasNo = new WebAssertion();