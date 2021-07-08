import { qte } from '@skintest/common';
import { I, perform, task, Task } from '@skintest/sdk';
import { $todos } from '../components/$todos';

/**
 * add new todo item to the list of todos
 * 
 * @param name tile of the new todo
 * @returns task
 */
export async function add_todo(name: string): Promise<Task> {
  return task(
    perform(`add todo ${qte(name)}`
      , I.fill($todos.what, name)
      , I.press('Enter')
    )
  );
}