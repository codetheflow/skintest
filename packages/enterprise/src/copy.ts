import { I, perform, Query, Recipe, recipe } from '@skintest/sdk';

  /**
   * copy to the clipboard by element text selection
   * 
   * @param query element selector, which text will be copied
   * @returns recipe
   */
export async function copy(query: Query<HTMLElement>): Promise<Recipe> {
  return recipe(
    perform(`copy ${query.toString()}`
      , I.select('text', query)
      , I.press('Control+C')
    )
  );
}