import { has, I, perform, RepeatRead, Task, task, till } from '@skintest/sdk';
import { $todos } from '../components/$todos';
import { add_todo } from './add-todo';

function add_next_todo(read: RepeatRead): Promise<Task> {
  const { index } = read.current();
  return add_todo(`generate todo #${index}`);
}

/**
 * generate todo times and put them to the list of todos
 * 
 * @param count number of items to generate
 * @returns generate todos client task
 */
export async function generate_todos(count: number): Promise<Task> {
  return task(
    perform(`generate ${count} todos`
      , I.do(add_next_todo, till.item)
      , till(`list has no ${count} items`)
      , I.see($todos.list, has.no.length, count)
    )
  );
}