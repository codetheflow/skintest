import { I, recipe } from '@skintest/sdk';
import { todos } from '../components/todos';

export const add_todo = recipe.client(
  /**
   * add new todo item to the list of todos
   * 
   * @param name tile of the new todo
   * @returns todo client recipe
   */
  function (name: string) {
    const { page } = this;

    return page.do(`I add todo \`${name}\``
      , I.fill(todos.what, name)
      , I.press('Enter')
    );
  }
);