import { has, I, Recipe, recipe, repeat } from '@skintest/sdk';
import { todos } from '../components/todos';

/**
 * clear todos list
 * 
 * @returns recipe
 */
export async function clear_todos(): Promise<Recipe> {
  return recipe(
    repeat(`until list has no items`
      , I.see(todos.list, has.length.above, 0)
      , I.say('than remove the first item')
      , I.hover(todos.item_label_at(0))
      , I.click(todos.item_remove_at(0))
    ),
  );
}