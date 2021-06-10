import { has, I, perform, Recipe, recipe, till } from '@skintest/sdk';
import { todos } from '../components/todos';
import { add_todo } from './add-todo';

/**
 * generate todo times and put them to the list of todos
 * 
 * @param count number of items to generate
 * @returns generate todos client recipe
 */
export async function generate_todos(count: number): Promise<Recipe> {
  let id = 1;

  return recipe(
    perform('add todo'
      , I.do(add_todo, `generated todo #${id++}`)
      , till(`until list has ${count} items`)
      , I.see(todos.list, has.no.length, count)
    )
  );
}