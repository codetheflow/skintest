// import { DOMElement } from '../sdk/dom';
// import { ElementRef } from '../sdk/engine';
// import * as playwright from 'playwright';

// export class PlaywrightElement<T extends DOMElement> implements ElementRef<T> {
//   constructor(private handlePromise: Promise<playwright.ElementHandle<T> | null>) {
//   }

//   async innerText(): Promise<string> {
//     const handle = await this.handlePromise;
//     const value = await handle?.innerText();
//     return value?.trim() || '';
//   }

// }