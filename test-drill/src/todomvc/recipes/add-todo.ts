import { I, perform, recipe, Recipe } from '@skintest/sdk';
import { todos } from '../components/todos';

/**
 * add new todo item to the list of todos
 * 
 * @param name tile of the new todo
 * @returns recipe
 */
export async function add_todo(name: string): Promise<Recipe> {
  return recipe(
    perform(`add todo \`${name}\``
      , I.fill(todos.what, name)
      , I.press('Enter')
    )
  );
}