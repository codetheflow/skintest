
import { has, I, perform, Recipe, recipe, till } from '@skintest/sdk';
import { todos } from '../components/todos';

/**
 * clear todos list
 * 
 * @returns recipe
 */
export async function clear_todos(): Promise<Recipe> {
  return recipe(
    perform('remove item'
      , I.hover(todos.item_label_at(0))
      , I.click(todos.item_remove_at(0))
      , till('list has items')
      , I.see(todos.list, has.length.above, 0)
    ),
  );
}