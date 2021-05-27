import { I, Query, recipe } from '@skintest/sdk';

export const copy_from = recipe.client(
  /**
   * copy to the clipboard by element text selection
   * 
   * @param query element selector, which text will be copied
   * @returns copy text client recipe
   */
  function (query: Query<HTMLElement>) {
    const client = this;
    return client.do(`I copy ${query.toString()}`
      , I.select(query)
      , I.press('Control+C')
    );
  }
);