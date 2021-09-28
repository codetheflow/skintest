import { perform, Query, Task, task } from '@skintest/sdk';
import { CanBrowseTheWeb } from '@skintest/web';

  /**
   * copy to the clipboard by element text selection
   * 
   * @param query element selector, which text will be copied
   * @returns task
   */
export async function copy(I: CanBrowseTheWeb, query: Query<HTMLElement>): Promise<Task> {
  return task(
    perform(`copy ${query.toString()}`
      , I.select('text', query)
      , I.press('Control+C')
    )
  );
}