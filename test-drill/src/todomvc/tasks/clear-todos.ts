import { perform, Task, task, till } from '@skintest/sdk';
import { has } from '@skintest/web';
import { Actor } from '../../actor';
import { $todos } from '../components/$todos';

/**
 * clear todos list
 * 
 * @returns task
 */
export async function clear_todos(I: Actor): Promise<Task> {
  return task(

    perform('remove items'
      , I.hover($todos.item_label_at(0))
      , I.click($todos.item_remove_at(0))
      , till('list has items')
      , I.see($todos.list, has.length.above, 0)
    ),
  );
}